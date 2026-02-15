import { PDFDocument, PDFName, rgb } from "pdf-lib";
import * as fontkit from "fontkit";
import { TravelInsuranceForm } from "@/types/form";
import { readFile } from "fs/promises";
import { join } from "path";

// Hardcoded agent info
const AGENT_NAME = "גארדיאן סוכנות לביטוח";
const AGENT_NUMBER = "78311";
const AGENT_COMPANY_ID = "516850682"; // ח.פ.

/**
 * Fill the original Harel "First Class" travel insurance PDF form
 * with data collected from the customer.
 *
 * The template PDF has 78 AcroForm fields.
 * We fill text fields, check checkboxes, embed signature + agent stamp.
 *
 * Coordinate system: pdf-lib uses BOTTOM-LEFT origin.
 * Page size: A4 (595.22 x 842 pt)
 */
export async function generatePdf(
  formData: TravelInsuranceForm
): Promise<Uint8Array> {
  const {
    personalInfo,
    healthDeclaration,
    insurancePlan,
    paymentInfo,
    signature,
  } = formData;

  // Load the original Harel PDF template
  const templatePath = join(process.cwd(), "templates", "harel-first-class-form.pdf");
  const templateBytes = await readFile(templatePath);
  const doc = await PDFDocument.load(templateBytes);

  // Register fontkit for custom font embedding
  doc.registerFontkit(fontkit);

  // Load Hebrew font (for Hebrew text fields)
  const hebFontPath = join(process.cwd(), "public", "fonts", "NotoSansHebrew-Regular.ttf");
  const hebFontBytes = await readFile(hebFontPath);
  const hebFont = await doc.embedFont(hebFontBytes);

  // Load Latin font (for numbers, dates, email, English text)
  const latFontPath = join(process.cwd(), "public", "fonts", "NotoSans-Regular.ttf");
  const latFontBytes = await readFile(latFontPath);
  const latFont = await doc.embedFont(latFontBytes);

  const form = doc.getForm();

  // ── Helpers ──

  const setHeb = (fieldName: string, value: string) => {
    try {
      const field = form.getTextField(fieldName);
      field.setText(value);
      field.updateAppearances(hebFont);
    } catch (e) {
      console.warn(`⚠️ PDF field "${fieldName}" not found:`, (e as Error).message);
    }
  };

  const setLat = (fieldName: string, value: string) => {
    try {
      const field = form.getTextField(fieldName);
      field.setText(value);
      field.updateAppearances(latFont);
    } catch (e) {
      console.warn(`⚠️ PDF field "${fieldName}" not found:`, (e as Error).message);
    }
  };

  const setCheck = (fieldName: string, checked: boolean) => {
    try {
      const field = form.getCheckBox(fieldName);
      if (checked) field.check();
      else field.uncheck();
    } catch (e) {
      console.warn(`⚠️ PDF checkbox "${fieldName}" not found:`, (e as Error).message);
    }
  };

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const today = formatDate(new Date().toISOString());

  // ============================================================
  // PAGE 1 — Agent info, policy dates, personal details
  // ============================================================

  // Agent info (hardcoded)
  setHeb("AgentName", AGENT_NAME);   // Fills all 3 widgets (page 1 header, page 4 witness, page 4 declaration)
  setLat("AgentNumber", AGENT_NUMBER);

  // Section א — Policy dates
  setLat("InsuranceBegin", formatDate(insurancePlan.startDate));
  setLat("Text2", formatDate(insurancePlan.endDate));

  // Section ב — Address & contact
  setHeb("StreetName", personalInfo.street);
  setLat("HouseNumber", personalInfo.streetNumber);
  setHeb("City", personalInfo.city);
  setHeb("OccupationCode", personalInfo.profession);
  setLat("PhoneNumber", personalInfo.phone);
  setLat("CellPhoneNumber", personalInfo.phone);
  setLat("EmailAddress", personalInfo.email);

  // Section ג — Insured person details
  // Checkboxes: Israeli resident declaration + currently in Israel
  // Check Box13 (y=351) = "הנני מצהיר כי המועמדים לביטוח הם תושבי ישראל"
  // Check Box14 (y=339) = "בעת רכישת הביטוח, המועמדים לביטוח נמצאים בישראל"
  setCheck("Check Box13", true);
  setCheck("Check Box14", true);

  // Gender field: two widgets sharing name "Gender"
  // Widget 0 (x=471) = נ (female), onValue = /False
  // Widget 1 (x=488) = ז (male), onValue = /True
  try {
    const genderField = form.getCheckBox("Gender");
    const genderWidgets = genderField.acroField.getWidgets();
    if (personalInfo.gender === 2) {
      // Male (ז) — set V=True, show widget 1
      genderField.acroField.dict.set(PDFName.of("V"), PDFName.of("True"));
      genderWidgets[0].dict.set(PDFName.of("AS"), PDFName.of("Off"));
      genderWidgets[1].dict.set(PDFName.of("AS"), PDFName.of("True"));
    } else if (personalInfo.gender === 3) {
      // Female (נ) — set V=False, show widget 0
      genderField.acroField.dict.set(PDFName.of("V"), PDFName.of("False"));
      genderWidgets[0].dict.set(PDFName.of("AS"), PDFName.of("False"));
      genderWidgets[1].dict.set(PDFName.of("AS"), PDFName.of("Off"));
    }
  } catch (e) {
    console.warn("⚠️ Gender field error:", (e as Error).message);
  }

  // Personal details
  setLat("PID", personalInfo.idNumber);  // Fills both widgets (page 1 + page 4)
  setHeb("LastName", personalInfo.lastName);
  setHeb("FirstName", personalInfo.firstName);
  setLat("BirthDate", formatDate(personalInfo.birthDate));

  // ============================================================
  // PAGE 2 — Health declaration
  // All yes/no questions must have BOTH כן and לא explicitly marked.
  //
  // Checkbox layout (sorted top→bottom, bottom-left origin):
  //   כן column: x ≈ 91-96
  //   לא column: x ≈ 38-49
  // ============================================================

  // Q1 (y=767): Medical purpose travel?
  setCheck("Check Box1", healthDeclaration.q1_medicalPurpose === true);
  setCheck("Check Box4", healthDeclaration.q1_medicalPurpose === false);

  // Q2 (y=725-726): Regular medications?
  setCheck("Check Box2", healthDeclaration.q2_regularMedication === true);
  setCheck("Check Box3", healthDeclaration.q2_regularMedication === false);

  // Q2.1: Specific treatments (when Q2=yes)
  if (healthDeclaration.q2_regularMedication) {
    // Treatments row (y=651)
    setCheck("Check Box16", healthDeclaration.q2_1_dialysis);          // x=511
    setCheck("Check Box20", healthDeclaration.q2_1_painClinic);        // x=365
    setCheck("Check Box19", healthDeclaration.q2_1_oncology);          // x=439
    // Row (y=639)
    setCheck("Check Box17", healthDeclaration.q2_1_bloodTransfusion);  // x=511
    // Biological (y=614)
    setCheck("Check dssaBox9", healthDeclaration.q2_1_biological);     // x=424
    // Medical conditions
    setCheck("Check Box27", healthDeclaration.q2_1_kidneyDisease);     // y=614 x=511
    setCheck("Check Box21", healthDeclaration.q2_1_nervousSystem);     // y=591 x=511
    setCheck("Check Box28", healthDeclaration.q2_1_crohn);             // y=578 x=248
    setCheck("Check Box29", healthDeclaration.q2_1_liverDisease);      // y=578 x=324
    setCheck("Check Box26", healthDeclaration.q2_1_als);               // y=578 x=430
    setCheck("Check Box22", healthDeclaration.q2_1_cysticFibrosis);    // y=579 x=511
    setCheck("Check Box25", healthDeclaration.q2_1_copd);              // y=565 x=447
    setCheck("Check Box23", healthDeclaration.q2_1_heartFailure);      // y=566 x=511
  }

  // Q3 (y=644-645): Hospitalization in last 6 months?
  setCheck("Check Box5", healthDeclaration.q3_hospitalization === true);
  setCheck("Check Box7", healthDeclaration.q3_hospitalization === false);

  // Q3.1 (y=588-589): Surgery performed and 3+ months ago?
  // Check Box6 (כן x=89 y=589) / Check Box8 (לא x=39 y=588)
  if (healthDeclaration.q3_hospitalization) {
    setCheck("Check Box6", healthDeclaration.q3_1_performedOver3Months === true);
    setCheck("Check Box8", healthDeclaration.q3_1_performedOver3Months === false);
  } else {
    // Q3=no → explicitly mark Q3.1 as "לא"
    setCheck("Check Box6", false);
    setCheck("Check Box8", true);
  }

  // Q3 sub-question area checkboxes:
  // Check Box9 (x=46 y=527) / Check Box10 (x=95 y=526) — these appear to be Q3 "additional" checkboxes
  // Check Box11 (x=95 y=473) / Check Box12 (x=47 y=473) — transitional Q3→Q4 area
  // These are likely "skip to Q4 if no" instructions or additional sub-questions.
  // Mark them consistently with Q3 answer:
  if (!healthDeclaration.q3_hospitalization) {
    // Q3 = no → mark corresponding "no" options
    setCheck("Check Box9", true);   // לא column (x=46)
    setCheck("Check Box10", false);  // כן column (x=95)
    setCheck("Check Box11", false);  // כן column (x=95)
    setCheck("Check Box12", true);   // לא column (x=47)
  }

  // Q4 (y=411): Test referral in last 6 months?
  setCheck("Check Box31", healthDeclaration.q4_testReferral === true);
  setCheck("Check Box30", healthDeclaration.q4_testReferral === false);

  // Q4.1 (y=342): Tests completed with normal results?
  if (healthDeclaration.q4_testReferral) {
    setCheck("Check Box32", healthDeclaration.q4_1_testsCompleted === true);
    setCheck("Check Box34", healthDeclaration.q4_1_testsCompleted === false);
  } else {
    // Q4=no → explicitly mark Q4.1 as "לא"
    setCheck("Check Box32", false);
    setCheck("Check Box34", true);
  }

  // Q5: Diagnosed in last 2 years (conditions)
  // Check Box40 (y=350) = stroke, Check Box41 (y=337) = heart, Check Box42 (y=324) = carotid
  setCheck("Check Box40", healthDeclaration.q5_stroke);
  setCheck("Check Box41", healthDeclaration.q5_heartDisease);
  setCheck("Check Box42", healthDeclaration.q5_carotidStenosis);

  // Q5.1 (y=275): Recent vs. old event
  // Check Box35 (כן x=96 y=275) = last 12 months
  // Check Box36 (לא x=49 y=275) = over 12 months ago
  const hasQ5Condition = healthDeclaration.q5_stroke || healthDeclaration.q5_heartDisease || healthDeclaration.q5_carotidStenosis;
  if (hasQ5Condition) {
    setCheck("Check Box35", healthDeclaration.q5_1_lastEventRecent === true);
    setCheck("Check Box36", healthDeclaration.q5_1_lastEventRecent === false);
  } else {
    // No Q5 conditions → explicitly mark Q5.1 as "לא"
    setCheck("Check Box35", false);
    setCheck("Check Box36", true);
  }

  // Q5.1 timing detail (y=270):
  // Check Box15 (x=511) = within 12 months, Check Box18 (x=376) = over 12 months
  if (hasQ5Condition) {
    setCheck("Check Box15", healthDeclaration.q5_1_lastEventRecent === true);
    setCheck("Check Box18", healthDeclaration.q5_1_lastEventRecent === false);
  } else {
    // No Q5 conditions → explicitly mark timing as "over 12 months" (לא)
    setCheck("Check Box15", false);
    setCheck("Check Box18", true);
  }

  // Q6 (y=211): Pregnant?
  // Check Box33 (כן x=96) / Check Box37 (לא x=48)
  if (personalInfo.gender === 3) {
    // Women — mark actual answer
    setCheck("Check Box33", healthDeclaration.q6_pregnant === true);
    setCheck("Check Box37", healthDeclaration.q6_pregnant === false);
  } else {
    // Men — Q6 not relevant, explicitly mark "לא"
    setCheck("Check Box33", false);
    setCheck("Check Box37", true);
  }

  // ============================================================
  // PAGE 3 — Insurance plan (mostly pre-checked in template)
  // ============================================================

  setLat("Text47", insurancePlan.laptopModel || "");
  setLat("Text48", insurancePlan.phoneModel || "");

  // Rental car deductible waiver checkbox
  if (insurancePlan.rentalCarDeductible) {
    setCheck("Check Box24", true);
  }

  // ============================================================
  // PAGE 4 — Declarations, signatures, payment
  //
  // Field layout (bottom-left origin, sorted top→bottom):
  //   y=586: MailAdv (marketing consent)
  //   y=397-401: Customer declaration row (FullName, PID, Date, ClientMust1)
  //   y=369-370: Agent witness row (AgentPID, SuchnutTypeID, AgentName, Date)
  //   y=352: AgentMust3 (agent signature placeholder)
  //   y=271-272: Agent declaration row (AgentName, AgentMust4, Date)
  //   y=229-230: Credit card holder info
  //   y=207: Credit card details
  //   y=184: CC holder address
  //   y=162: CC holder phones
  //   y=41: CC signature (Signature72, Date)
  // ============================================================

  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`;

  // Section ז — Insured person declaration
  setHeb("FullName", fullName);
  setLat("Date", today);  // Fills all 4 widgets (page 4: declaration, witness, agent, CC)

  // Agent witness section — "עד לחתימה (סוכן הביטוח)"
  // AgentPID (y=370) = מס' רישיון = ח.פ. 516850682
  setLat("AgentPID", AGENT_COMPANY_ID);
  // SuchnutTypeID (y=369) = ת"ז / ח.פ. of agency
  setLat("SuchnutTypeID", AGENT_COMPANY_ID);

  // Marketing consent (y=586)
  setCheck("MailAdv", signature.agreedToMarketing);

  // Section ט — Credit card payment
  if (!paymentInfo.skippedByCustomer && paymentInfo.cardNumber) {
    setHeb("FullNameCreditCardHolder", paymentInfo.cardHolderName || fullName);
    setLat("PIDCreditCardHolder", paymentInfo.cardHolderId || personalInfo.idNumber);
    setLat("Text64", String(paymentInfo.numPayments || 1));
    setLat("CreditCardNumber", paymentInfo.cardNumber);
    setLat("MonthDigit", paymentInfo.expiryMonth);
    setLat("YearDigit", paymentInfo.expiryYear);
    setLat("Text68", paymentInfo.cvv || "");
    const addr = `${personalInfo.street} ${personalInfo.streetNumber}, ${personalInfo.city}`;
    setHeb("AdressCreditCardHolder", addr);
    setLat("CCHPhoneNumber", personalInfo.phone);
    setLat("CCHCellPhoneNumber", personalInfo.phone);
  } else if (paymentInfo.skippedByCustomer) {
    setHeb("FullNameCreditCardHolder", "הסוכן ישלים");
  } else if (paymentInfo.last4Digits) {
    setHeb("FullNameCreditCardHolder", paymentInfo.cardHolderName || fullName);
    setLat("PIDCreditCardHolder", paymentInfo.cardHolderId || personalInfo.idNumber);
    setLat("CreditCardNumber", `**** **** **** ${paymentInfo.last4Digits}`);
    setLat("MonthDigit", paymentInfo.expiryMonth);
    setLat("YearDigit", paymentInfo.expiryYear);
  }

  // ── Embed images on page 4 ──
  const pages = doc.getPages();
  const p4 = pages[3];

  // ── Customer signature ──
  if (signature.signatureDataUrl) {
    try {
      const base64Data = signature.signatureDataUrl.split(",")[1];
      const sigBytes = Buffer.from(base64Data, "base64");
      const sigImage = await doc.embedPng(sigBytes);

      // Customer signature on "מבוטח ראשי" declaration line
      // ClientMust1 at y=401 x=57. Place signature to its left/on it.
      p4.drawImage(sigImage, {
        x: 40,
        y: 395,
        width: 70,
        height: 20,
      });

      // Customer signature on credit card area (if paying)
      // Signature72 at y=41 x=89
      if (!paymentInfo.skippedByCustomer) {
        p4.drawImage(sigImage, {
          x: 80,
          y: 35,
          width: 70,
          height: 20,
        });
      }
    } catch (sigError) {
      console.warn("⚠️ Could not embed customer signature:", (sigError as Error).message);
    }
  }

  // ── Agent stamp + signature image ──
  // The stamp image (guardian-stamp.png, 558x222) contains
  // company stamp text + agent's handwritten signature.
  try {
    const stampPath = join(process.cwd(), "public", "images", "guardian-stamp.png");
    const stampBytes = await readFile(stampPath);
    const stampImage = await doc.embedPng(stampBytes);

    // Stamp original aspect ratio: 558/222 ≈ 2.51
    // We need it to fit in small areas without overlapping text.

    // 1. Agent witness section — "חתימה:" + "חותמת:" area
    //    AgentMust3 (signature field) is at y=352 x=453
    //    The stamp/signature area spans below the AgentPID/SuchnutTypeID row (y=369-370)
    //    Available space: roughly x=30-200, y=335-365
    //    Using smaller dimensions to avoid overlap
    const stampW1 = 130;
    const stampH1 = 52; // 130/2.51
    p4.drawImage(stampImage, {
      x: 35,
      y: 338,
      width: stampW1,
      height: stampH1,
    });

    // 2. Agent declaration section — "חתימת הסוכן:" area
    //    AgentMust4 at y=272 x=82
    //    Available space: roughly x=30-160, y=255-275
    const stampW2 = 110;
    const stampH2 = 44; // 110/2.51
    p4.drawImage(stampImage, {
      x: 35,
      y: 258,
      width: stampW2,
      height: stampH2,
    });
  } catch (stampError) {
    console.warn("⚠️ Could not embed agent stamp:", (stampError as Error).message);
  }

  // Flatten form (make non-editable)
  form.flatten();

  const pdfBytes = await doc.save();
  console.log(`✅ PDF generated successfully (${(pdfBytes.length / 1024).toFixed(1)} KB)`);
  return pdfBytes;
}
