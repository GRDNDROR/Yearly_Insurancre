import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { EMAIL_CONFIG } from "@/lib/config";
import { TravelInsuranceForm } from "@/types/form";
import { generatePdf } from "@/lib/pdf-generator";

const resend = new Resend(process.env.RESEND_API_KEY);

// Build HTML email body from form data
function buildEmailHtml(formData: TravelInsuranceForm, hasPdf: boolean): string {
  const { personalInfo, healthDeclaration, insurancePlan, paymentInfo, signature, agentInfo } =
    formData;

  const genderLabel = personalInfo.gender === 2 ? "זכר" : personalInfo.gender === 3 ? "נקבה" : "—";

  const activeExtensions = [
    insurancePlan.luggage && "כבודה",
    insurancePlan.tripCancellation && "ביטול נסיעה",
    insurancePlan.preExistingCondition && "החמרה למצב רפואי קודם",
    insurancePlan.extremeSports && "ספורט אתגרי",
    insurancePlan.winterSports && "ספורט חורף",
    insurancePlan.rentalCarDeductible && "ביטול השתתפות עצמית לרכב שכור",
  ]
    .filter(Boolean)
    .join(", ");

  const healthSummary: string[] = [];
  if (healthDeclaration.q1_medicalPurpose === false)
    healthSummary.push("מטרת נסיעה רפואית: לא");
  if (healthDeclaration.q2_regularMedication === true)
    healthSummary.push("תרופות קבועות: כן");
  else if (healthDeclaration.q2_regularMedication === false)
    healthSummary.push("תרופות קבועות: לא");
  if (healthDeclaration.q3_hospitalization === true)
    healthSummary.push("אשפוז/ניתוח: כן");
  else if (healthDeclaration.q3_hospitalization === false)
    healthSummary.push("אשפוז/ניתוח: לא");
  if (healthDeclaration.q4_testReferral === true)
    healthSummary.push("הפניה לבדיקות: כן");
  else if (healthDeclaration.q4_testReferral === false)
    healthSummary.push("הפניה לבדיקות: לא");

  const paymentStatus = paymentInfo.skippedByCustomer
    ? '<span style="color: #d97706; font-weight: bold;">⏳ ממתין להשלמה ע"י הסוכן</span>'
    : paymentInfo.last4Digits
    ? `**** **** **** ${paymentInfo.last4Digits} | תוקף: ${paymentInfo.expiryMonth}/${paymentInfo.expiryYear}`
    : "לא הוזנו פרטי תשלום";

  return `
    <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #1e40af; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 20px;">✈️ טופס הצעה לביטוח נסיעות - פירסט קלאס</h1>
        <p style="margin: 5px 0 0; font-size: 14px; opacity: 0.9;">פוליסה שנתית לאנשי עסקים</p>
      </div>

      <div style="border: 1px solid #e5e7eb; border-top: 0; padding: 20px; border-radius: 0 0 8px 8px;">

        ${hasPdf ? `
        <div style="background: #ecfdf5; border: 1px solid #6ee7b7; border-radius: 8px; padding: 12px; margin-bottom: 20px; text-align: center;">
          <p style="margin: 0; color: #065f46; font-size: 14px;">📎 <strong>טופס PDF מלא מצורף למייל זה</strong></p>
        </div>
        ` : ""}

        <h2 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 8px;">👤 פרטי המבוטח</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 6px 0; color: #6b7280; width: 140px;">שם מלא:</td><td style="padding: 6px 0; font-weight: bold;">${personalInfo.firstName} ${personalInfo.lastName}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">שם באנגלית:</td><td style="padding: 6px 0;">${personalInfo.engFirstName} ${personalInfo.engLastName}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">ת.ז.:</td><td style="padding: 6px 0; font-weight: bold;">${personalInfo.idNumber}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">תאריך לידה:</td><td style="padding: 6px 0;">${personalInfo.birthDate}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">מין:</td><td style="padding: 6px 0;">${genderLabel}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">טלפון:</td><td style="padding: 6px 0;">${personalInfo.phone}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">דוא"ל:</td><td style="padding: 6px 0;">${personalInfo.email}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">כתובת:</td><td style="padding: 6px 0;">${personalInfo.street} ${personalInfo.streetNumber}, ${personalInfo.city} ${personalInfo.zipCode}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">מקצוע:</td><td style="padding: 6px 0;">${personalInfo.profession}</td></tr>
        </table>

        <h2 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 8px; margin-top: 24px;">🏥 הצהרת בריאות</h2>
        <ul style="font-size: 14px; padding-right: 20px;">
          ${healthSummary.map((item) => `<li style="padding: 4px 0;">${item}</li>`).join("")}
        </ul>

        <h2 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 8px; margin-top: 24px;">🛡️ תכנית ביטוח</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 6px 0; color: #6b7280; width: 140px;">תקופה:</td><td style="padding: 6px 0;">${insurancePlan.startDate} → ${insurancePlan.endDate}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">הרחבות:</td><td style="padding: 6px 0;">${activeExtensions || "—"}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">מחשב נייד:</td><td style="padding: 6px 0;">${insurancePlan.laptopModel || "—"}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">טלפון נייד:</td><td style="padding: 6px 0;">${insurancePlan.phoneModel || "—"}</td></tr>
        </table>

        <h2 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 8px; margin-top: 24px;">💳 תשלום</h2>
        <p style="font-size: 14px;">${paymentStatus}</p>

        <h2 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 8px; margin-top: 24px;">✍️ חתימה</h2>
        ${
          signature.signatureDataUrl
            ? `<img src="${signature.signatureDataUrl}" alt="חתימת המבוטח" style="max-width: 300px; border: 1px solid #e5e7eb; border-radius: 4px; padding: 8px;" />`
            : '<p style="color: #ef4444;">חתימה חסרה</p>'
        }
        <p style="font-size: 12px; color: #6b7280;">נחתם בתאריך: ${signature.signedAt ? new Date(signature.signedAt).toLocaleString("he-IL") : "—"}</p>

        <div style="margin-top: 24px; padding: 16px; background: #f0f9ff; border-radius: 8px; border-right: 4px solid #1e40af;">
          <p style="margin: 0; font-size: 14px;"><strong>סוכן:</strong> ${agentInfo.agentName}</p>
          <p style="margin: 4px 0 0; font-size: 14px;"><strong>סוכנות:</strong> ${agentInfo.agencyName}</p>
          ${agentInfo.agentNumber ? `<p style="margin: 4px 0 0; font-size: 14px;"><strong>מספר סוכן:</strong> ${agentInfo.agentNumber}</p>` : ""}
        </div>

        <p style="margin-top: 24px; font-size: 11px; color: #9ca3af; text-align: center;">
          נוצר אוטומטית ע"י מערכת ביטוח נסיעות גארדיאן | ${new Date().toLocaleString("he-IL")}
        </p>
      </div>
    </div>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const formData: TravelInsuranceForm = await request.json();
    const { personalInfo } = formData;

    const subject = EMAIL_CONFIG.subjectTemplate(
      `${personalInfo.firstName} ${personalInfo.lastName}`,
      personalInfo.idNumber
    );

    const recipients = [EMAIL_CONFIG.guardian, EMAIL_CONFIG.harel];
    const uniqueRecipients = [...new Set(recipients)];

    // ── Generate PDF ──
    let pdfBuffer: Uint8Array | null = null;
    try {
      pdfBuffer = await generatePdf(formData);
      console.log(`✅ PDF generated successfully (${(pdfBuffer.length / 1024).toFixed(1)} KB)`);
    } catch (pdfError) {
      console.error("⚠️ PDF generation failed:", pdfError);
      // Continue without PDF - email will still be sent
    }

    const emailHtml = buildEmailHtml(formData, !!pdfBuffer);

    console.log("═══════════════════════════════════════════");
    console.log("📧 שליחת טופס ביטוח נסיעות");
    console.log(`נושא: ${subject}`);
    console.log(`נמענים: ${uniqueRecipients.join(", ")}`);
    console.log(`מבוטח: ${personalInfo.firstName} ${personalInfo.lastName} (${personalInfo.idNumber})`);
    console.log(`PDF: ${pdfBuffer ? `✅ ${(pdfBuffer.length / 1024).toFixed(1)} KB` : "❌ לא נוצר"}`);
    console.log("═══════════════════════════════════════════");

    // ── Send email via Resend ──
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "re_YOUR_API_KEY_HERE") {
      const emailPayload: Parameters<typeof resend.emails.send>[0] = {
        from: "ביטוח נסיעות גארדיאן <onboarding@resend.dev>", // TODO: Update with verified domain
        to: uniqueRecipients,
        subject,
        html: emailHtml,
      };

      // Attach PDF if generated
      if (pdfBuffer) {
        emailPayload.attachments = [
          {
            filename: `travel-insurance-${personalInfo.idNumber}-${Date.now()}.pdf`,
            content: Buffer.from(pdfBuffer),
          },
        ];
      }

      const { data, error } = await resend.emails.send(emailPayload);

      if (error) {
        console.error("Resend error:", error);
        return NextResponse.json(
          { success: false, message: "שגיאה בשליחת המייל", error },
          { status: 500 }
        );
      }

      console.log("✅ מייל נשלח בהצלחה! ID:", data?.id);
    } else {
      console.log("⚠️ RESEND_API_KEY not configured - email not sent (mock mode)");
      console.log("📋 Email HTML generated successfully, length:", emailHtml.length);
    }

    return NextResponse.json({
      success: true,
      message: "הטופס נשלח בהצלחה",
      recipients: uniqueRecipients,
      hasPdf: !!pdfBuffer,
      submittedAt: new Date().toISOString(),
      reference: `TI-${Date.now().toString(36).toUpperCase()}`,
    });
  } catch (error) {
    console.error("Error submitting form:", error);
    return NextResponse.json(
      { success: false, message: "שגיאה בשליחת הטופס" },
      { status: 500 }
    );
  }
}
