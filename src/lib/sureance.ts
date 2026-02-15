// ── Sureance API Client ──
// OAuth2 client_credentials flow + customer search/details
// Falls back to mock data when credentials are not configured

import {
  SureanceCustomer,
  SureanceSearchRequest,
  SureanceSearchResponse,
} from "@/types/form";

// ── Internal Types ──

interface OAuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface TokenCache {
  accessToken: string;
  expiresAt: number;
}

// ── Constants ──

const AUTH_URL = "https://api.surense.com/connect/token";
const BASE_URL = "https://api.surense.com/api/v1";

// Buffer before expiry to avoid using a token that's about to expire
const TOKEN_EXPIRY_BUFFER_MS = 60 * 1000;

// ── Mock Data ──

const MOCK_CUSTOMER: SureanceCustomer = {
  id: "mock-001",
  idNumber: "037039401",
  idType: 1,
  firstName: "דרור",
  lastName: "אדרי",
  engFirstName: "Dror",
  engLastName: "Edri",
  phoneNumber1: "0541234567",
  phoneNumber2: "",
  email: "dror@grdn.co.il",
  email2: "",
  gender: 2,
  birthDate: "1985-03-15",
  maritalStatus: 1,
  profession: "סוכן ביטוח",
  street: "הרצל",
  streetNumber: "1",
  city: "תל אביב",
  zipCode: "6100000",
  backgroundDiseases: "",
};

// ── Token Management ──

let tokenCache: TokenCache | null = null;

function getCredentials(): { clientId: string; clientSecret: string } | null {
  const clientId = process.env.SUREANCE_CLIENT_ID ?? "";
  const clientSecret = process.env.SUREANCE_CLIENT_SECRET ?? "";

  if (!clientId || !clientSecret) {
    return null;
  }

  return { clientId, clientSecret };
}

function isTokenValid(): boolean {
  if (!tokenCache) return false;
  return Date.now() < tokenCache.expiresAt;
}

async function fetchAccessToken(
  clientId: string,
  clientSecret: string
): Promise<string> {
  // Return cached token if still valid
  if (isTokenValid()) {
    return tokenCache!.accessToken;
  }

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
  });

  const response = await fetch(AUTH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new SureanceApiError(
      `OAuth token request failed: ${response.status} ${response.statusText}`,
      response.status,
      errorText
    );
  }

  const data: OAuthTokenResponse = await response.json();

  tokenCache = {
    accessToken: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000 - TOKEN_EXPIRY_BUFFER_MS,
  };

  return data.access_token;
}

// ── Error Class ──

export class SureanceApiError extends Error {
  public readonly statusCode: number | undefined;
  public readonly responseBody: string | undefined;

  constructor(message: string, statusCode?: number, responseBody?: string) {
    super(message);
    this.name = "SureanceApiError";
    this.statusCode = statusCode;
    this.responseBody = responseBody;
  }
}

// ── API Methods ──

/**
 * Search for a customer by Israeli ID number.
 * Uses the Sureance /customers/search endpoint with proper filter format.
 * Returns the matching customer or null if not found.
 * Falls back to mock data when credentials are not configured.
 */
export async function searchCustomerByIdNumber(
  idNumber: string
): Promise<SureanceCustomer | null> {
  const credentials = getCredentials();

  // Mock fallback
  if (!credentials) {
    console.log("[Sureance] No credentials configured, using mock data");
    await new Promise((r) => setTimeout(r, 500)); // Simulate network delay
    if (idNumber === MOCK_CUSTOMER.idNumber) {
      return { ...MOCK_CUSTOMER };
    }
    // Return a generated mock for any ID number
    return {
      ...MOCK_CUSTOMER,
      id: `mock-${idNumber}`,
      idNumber,
      firstName: "",
      lastName: "",
      engFirstName: "",
      engLastName: "",
      phoneNumber1: "",
      email: "",
      street: "",
      streetNumber: "",
      city: "",
      zipCode: "",
      birthDate: "",
      profession: "",
    };
  }

  const token = await fetchAccessToken(
    credentials.clientId,
    credentials.clientSecret
  );

  // Sureance uses a structured search request body
  const searchBody: SureanceSearchRequest = {
    startRow: 0,
    endRow: 1,
    filtersOperator: "and",
    filters: [
      {
        field: "idNumber",
        value: idNumber,
        operator: "equals",
      },
    ],
    sorts: [
      {
        field: "lastName",
        dir: "asc",
      },
    ],
  };

  const response = await fetch(`${BASE_URL}/customers/search`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(searchBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new SureanceApiError(
      `Customer search failed: ${response.status} ${response.statusText}`,
      response.status,
      errorText
    );
  }

  const result: SureanceSearchResponse = await response.json();

  if (!result.data || result.data.length === 0) {
    return null;
  }

  return result.data[0];
}

/**
 * Get full customer details by Sureance internal ID.
 * Falls back to mock data when credentials are not configured.
 */
export async function getCustomerDetails(
  customerId: string
): Promise<SureanceCustomer> {
  const credentials = getCredentials();

  // Mock fallback
  if (!credentials) {
    console.log("[Sureance] No credentials configured, using mock data");
    await new Promise((r) => setTimeout(r, 300));
    return { ...MOCK_CUSTOMER, id: customerId };
  }

  const token = await fetchAccessToken(
    credentials.clientId,
    credentials.clientSecret
  );

  const response = await fetch(`${BASE_URL}/customers/${customerId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new SureanceApiError(
      `Customer details fetch failed: ${response.status} ${response.statusText}`,
      response.status,
      errorText
    );
  }

  const customer: SureanceCustomer = await response.json();
  return customer;
}

/**
 * Map a SureanceCustomer from the CRM API to our form's PersonalInfo format.
 * Phone numbers are formatted as 05X-XXXXXXX.
 */
export function mapCustomerToPersonalInfo(
  customer: SureanceCustomer,
  existingPhone: string
): {
  firstName: string;
  lastName: string;
  engFirstName: string;
  engLastName: string;
  birthDate: string;
  gender: number;
  phone: string;
  email: string;
  street: string;
  streetNumber: string;
  city: string;
  zipCode: string;
  profession: string;
  idNumber: string;
  idType: number;
} {
  // Format phone: insert dash after 3 digits if it's 10 digits
  const rawPhone = customer.phoneNumber1 || existingPhone.replace(/\D/g, "");
  const formattedPhone =
    rawPhone.length === 10
      ? `${rawPhone.slice(0, 3)}-${rawPhone.slice(3)}`
      : rawPhone;

  return {
    idNumber: customer.idNumber,
    idType: customer.idType || 1,
    firstName: customer.firstName || "",
    lastName: customer.lastName || "",
    engFirstName: customer.engFirstName || "",
    engLastName: customer.engLastName || "",
    birthDate: customer.birthDate || "",
    gender: customer.gender || 1,
    phone: formattedPhone,
    email: customer.email || "",
    street: customer.street || "",
    streetNumber: customer.streetNumber || "",
    city: customer.city || "",
    zipCode: customer.zipCode || "",
    profession: customer.profession || "",
  };
}

/**
 * Check if the Sureance API is configured with real credentials.
 */
export function isConfigured(): boolean {
  return getCredentials() !== null;
}

/**
 * Clear the cached OAuth token.
 * Useful for testing or when credentials change.
 */
export function clearTokenCache(): void {
  tokenCache = null;
}
