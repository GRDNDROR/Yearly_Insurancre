import { NextRequest, NextResponse } from "next/server";
import {
  searchCustomerByIdNumber,
  mapCustomerToPersonalInfo,
  SureanceApiError,
} from "@/lib/sureance";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idNumber, phone } = body;

    if (!idNumber || typeof idNumber !== "string") {
      return NextResponse.json(
        { success: false, message: "מספר ת.ז. חסר" },
        { status: 400 }
      );
    }

    console.log(`[Customer Search] Searching for ID: ${idNumber}`);

    const customer = await searchCustomerByIdNumber(idNumber);

    if (!customer) {
      console.log(`[Customer Search] No customer found for ID: ${idNumber}`);
      return NextResponse.json({
        success: true,
        found: false,
        message: "לקוח לא נמצא במערכת",
      });
    }

    console.log(
      `[Customer Search] Found: ${customer.firstName} ${customer.lastName} (CRM ID: ${customer.id})`
    );

    // Map CRM data to our PersonalInfo format
    const personalInfo = mapCustomerToPersonalInfo(customer, phone || "");

    return NextResponse.json({
      success: true,
      found: true,
      customerId: customer.id,
      personalInfo,
    });
  } catch (error) {
    if (error instanceof SureanceApiError) {
      console.error(
        `[Customer Search] Sureance API error: ${error.message}`,
        error.statusCode,
        error.responseBody
      );
      return NextResponse.json(
        {
          success: false,
          message: "שגיאה בחיפוש לקוח במערכת הניהול",
          error: error.message,
        },
        { status: error.statusCode === 401 ? 401 : 502 }
      );
    }

    console.error("[Customer Search] Unexpected error:", error);
    return NextResponse.json(
      { success: false, message: "שגיאה לא צפויה" },
      { status: 500 }
    );
  }
}
