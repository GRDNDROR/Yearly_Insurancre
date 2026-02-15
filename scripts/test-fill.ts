import { generatePdf } from "../src/lib/pdf-generator";
import { writeFileSync } from "fs";
import { TravelInsuranceForm } from "../src/types/form";

async function test() {
  const formData: TravelInsuranceForm = {
    personalInfo: {
      idNumber: "037039401", idType: 1,
      firstName: "דרור", lastName: "אדרי",
      engFirstName: "Dror", engLastName: "Edri",
      birthDate: "1985-03-15", gender: 2,
      phone: "050-1234567", email: "dror@grdn.co.il",
      street: "הרצל", streetNumber: "1",
      city: "תל אביב", zipCode: "6100000",
      profession: "סוכן ביטוח",
    },
    healthDeclaration: {
      q1_medicalPurpose: false, q2_regularMedication: false,
      q2_1_painClinic: false, q2_1_bloodTransfusion: false,
      q2_1_dialysis: false, q2_1_oncology: false, q2_1_biological: false,
      q2_1_kidneyDisease: false, q2_1_nervousSystem: false,
      q2_1_crohn: false, q2_1_copd: false, q2_1_cysticFibrosis: false,
      q2_1_als: false, q2_1_liverDisease: false, q2_1_heartFailure: false,
      q2_1_stroke: false, q3_hospitalization: false,
      q3_1_performedOver3Months: null, q4_testReferral: false,
      q4_1_testsCompleted: null, q4_testDetails: "",
      q5_stroke: false, q5_heartDisease: false,
      q5_carotidStenosis: false, q5_1_lastEventRecent: null,
      q6_pregnant: false, medicalDocumentUrl: "",
    },
    insurancePlan: {
      startDate: "2026-03-01", endDate: "2027-03-01",
      baseMedical: true, searchAndRescue: true, thirdPartyLiability: true,
      luggage: true, tripCancellation: true, preExistingCondition: true,
      extremeSports: true, winterSports: true,
      laptopModel: "MacBook Pro 14", phoneModel: "iPhone 15 Pro",
      rentalCarDeductible: false,
    },
    paymentInfo: {
      token: "", last4Digits: "", expiryMonth: "", expiryYear: "",
      skippedByCustomer: true,
    },
    signature: {
      signatureDataUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      signedAt: "2026-02-14T21:15:07.000Z",
      agreedToTerms: true, agreedToPrivacy: true, agreedToMarketing: false,
    },
    agentInfo: {
      agentName: "דרור אדרי", agentNumber: "12345",
      agencyName: "גארדיאן סוכנות לביטוח",
    },
    isResidentOfIsrael: true, isCurrentlyInIsrael: true,
    crmCustomerId: "mock-001", submittedAt: "2026-02-14T21:15:07.000Z",
  };

  const pdfBytes = await generatePdf(formData);
  const outPath = "/tmp/test-harel-filled.pdf";
  writeFileSync(outPath, pdfBytes);
  console.log(`\n✅ Saved to ${outPath} (${(pdfBytes.length / 1024).toFixed(1)} KB)`);
  console.log("Open with: open " + outPath);
}

test().catch(console.error);
