/**
 * Test script: Fill the original Harel PDF form with sample data
 * Run with: npx tsx scripts/test-fill-pdf.ts
 * Output: scripts/test-filled.pdf
 */

import { PDFDocument, rgb, StandardFonts, PDFPage, PDFFont } from "pdf-lib";
import fontkit from "fontkit";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

// Hebrew text needs to be reversed for pdf-lib (RTL rendering)
function reverseHebrew(text: string): string {
  // Split text into segments of Hebrew and non-Hebrew
  const segments: { text: string; isHebrew: boolean }[] = [];
  let current = "";
  let currentIsHebrew = false;

  for (const char of text) {
    const isHeb = /[\u0590-\u05FF]/.test(char);
    if (current === "") {
      current = char;
      currentIsHebrew = isHeb;
    } else if (isHeb === currentIsHebrew) {
      current += char;
    } else {
      segments.push({ text: current, isHebrew: currentIsHebrew });
      current = char;
      currentIsHebrew = isHeb;
    }
  }
  if (current) {
    segments.push({ text: current, isHebrew: currentIsHebrew });
  }

  // Reverse Hebrew segments and reverse overall order for RTL
  const reversed = segments.map((s) =>
    s.isHebrew ? { ...s, text: s.text.split("").reverse().join("") } : s
  );
  reversed.reverse();

  return reversed.map((s) => s.text).join("");
}

// Helper: draw Hebrew text right-aligned at a given x position
function drawHebrew(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  font: PDFFont,
  size: number = 9,
  color = rgb(0, 0, 0)
) {
  const reversed = reverseHebrew(text);
  const width = font.widthOfTextAtSize(reversed, size);
  page.drawText(reversed, { x: x - width, y, size, font, color });
}

// Helper: draw LTR text (English, numbers) left-aligned
function drawLtr(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  font: PDFFont,
  size: number = 9,
  color = rgb(0, 0, 0)
) {
  page.drawText(text, { x, y, size, font, color });
}

// Draw a checkmark (✓)
function drawCheck(
  page: PDFPage,
  x: number,
  y: number,
  font: PDFFont,
  size: number = 12
) {
  page.drawText("✓", { x, y, size, font, color: rgb(0, 0, 0) });
}

async function main() {
  const templatePath = join(
    process.cwd(),
    "templates",
    "harel-first-class-form.pdf"
  );
  const pdfBytes = readFileSync(templatePath);
  const doc = await PDFDocument.load(pdfBytes);

  doc.registerFontkit(fontkit);

  // Load Hebrew font
  const hebFontBytes = readFileSync(
    join(process.cwd(), "public", "fonts", "NotoSansHebrew-Regular.ttf")
  );
  const hebBoldBytes = readFileSync(
    join(process.cwd(), "public", "fonts", "NotoSansHebrew-Bold.ttf")
  );
  const latFontBytes = readFileSync(
    join(process.cwd(), "public", "fonts", "NotoSans-Regular.ttf")
  );

  const hebFont = await doc.embedFont(hebFontBytes);
  const hebBold = await doc.embedFont(hebBoldBytes);
  const latFont = await doc.embedFont(latFontBytes);

  const pages = doc.getPages();
  const p1 = pages[0]; // Page 1
  const p2 = pages[1]; // Page 2
  const p3 = pages[2]; // Page 3
  const p4 = pages[3]; // Page 4

  // All coordinates in PDF points (0,0 = bottom-left)
  // A4 = 595.276 x 841.89

  // ============================================
  // PAGE 1 - פרטי סוכן, תוקף פוליסה, פרטים אישיים
  // ============================================

  // שם הסוכן (top-left area)
  drawHebrew(p1, "דרור אדרי", 190, 697, hebFont, 9);

  // מס' הסוכן
  drawLtr(p1, "12345", 100, 680, latFont, 9);

  // Section א - תוקף פוליסה
  // מועד רכישה - dates
  // מ- dd/mm/yyyy
  drawLtr(p1, "01", 440, 592, latFont, 9);  // day from
  drawLtr(p1, "03", 410, 592, latFont, 9);  // month from
  drawLtr(p1, "2026", 370, 592, latFont, 9); // year from
  // עד- dd/mm/yyyy
  drawLtr(p1, "01", 310, 592, latFont, 9);  // day to
  drawLtr(p1, "03", 280, 592, latFont, 9);  // month to
  drawLtr(p1, "2027", 240, 592, latFont, 9); // year to

  // Section ב - כתובת ופרטי קשר
  // כתובת רח'
  drawHebrew(p1, "הרצל", 565, 493, hebFont, 9);
  // מס'
  drawLtr(p1, "1", 430, 493, latFont, 9);
  // יישוב
  drawHebrew(p1, "תל אביב", 380, 493, hebFont, 9);
  // מקצוע/עיסוק
  drawHebrew(p1, "סוכן ביטוח", 185, 493, hebFont, 9);

  // טלפון
  drawLtr(p1, "050-1234567", 520, 468, latFont, 9);
  // נייד - same
  drawLtr(p1, "050-1234567", 432, 468, latFont, 9);
  // דוא"ל
  drawLtr(p1, "dror@grdn.co.il", 100, 449, latFont, 9);

  // Section ג - פרטי המועמד לביטוח
  // הצהרה - תושבי ישראל - כן (already marked)
  // נמצאים בישראל - כן (already marked)

  // מבוטח ראשי row
  // מין - ז checkbox (need to mark ז)
  drawCheck(p1, 361, 367, hebFont, 11);

  // מס' ת.ז.
  drawLtr(p1, "037039401", 337, 369, latFont, 9);

  // שם משפחה
  drawHebrew(p1, "אדרי", 285, 369, hebFont, 9);

  // שם פרטי
  drawHebrew(p1, "דרור", 215, 369, hebFont, 9);

  // תאריך לידה
  drawLtr(p1, "15/03/1985", 90, 369, latFont, 9);

  // ============================================
  // PAGE 2 - הצהרת בריאות
  // ============================================

  // All questions answered "לא" (No)
  // Question 1 - לא
  drawCheck(p2, 72, 718, hebFont, 11);

  // Question 2 - לא
  drawCheck(p2, 72, 668, hebFont, 11);

  // Question 3 - לא
  drawCheck(p2, 72, 460, hebFont, 11);

  // Question 4 - לא
  drawCheck(p2, 72, 355, hebFont, 11);

  // Question 5 - לא (not directly asked - skip if N/A)

  // ============================================
  // PAGE 3 - תכנית הביטוח (mostly pre-filled with ✔)
  // ============================================

  // מחשב אישי נישא/טאבלט - דגם
  drawLtr(p3, "MacBook Pro 14", 165, 422, latFont, 8);

  // טלפון נייד - דגם
  drawLtr(p3, "iPhone 15 Pro", 165, 396, latFont, 8);

  // ============================================
  // PAGE 4 - הצהרות, חתימות, תשלום
  // ============================================

  // Section ז - הצהרת המועמד לביטוח
  // מבוטח ראשי row - תאריך, שם המבוטח, מספר זהות, חתימה
  drawLtr(p4, "14/02/2026", 475, 434, latFont, 9);
  drawHebrew(p4, "דרור אדרי", 375, 434, hebFont, 9);
  drawLtr(p4, "037039401", 270, 434, latFont, 9);

  // עד לחתימה (סוכן) - תאריך, שם, ת"ז, מס' רישיון
  drawLtr(p4, "14/02/2026", 475, 410, latFont, 8);
  drawHebrew(p4, "דרור אדרי", 380, 410, hebFont, 8);
  drawLtr(p4, "037039401", 255, 410, latFont, 8);
  drawLtr(p4, "12345", 140, 410, latFont, 8);

  // Section ח - הצהרת הסוכן
  drawLtr(p4, "14/02/2026", 475, 353, latFont, 8);
  drawHebrew(p4, "דרור אדרי", 345, 353, hebFont, 8);

  // Section ט - תשלום באמצעות כרטיס אשראי
  // שם בעל כרטיס
  drawHebrew(p4, "דרור אדרי", 530, 302, hebFont, 9);
  // מספר ת.ז.
  drawLtr(p4, "037039401", 355, 302, latFont, 9);
  // מספר תשלומים
  drawLtr(p4, "1", 200, 302, latFont, 9);

  // מס' כרטיס
  drawLtr(p4, "4580 **** **** 1234", 455, 280, latFont, 9);
  // בתוקף עד
  drawLtr(p4, "12/28", 295, 280, latFont, 9);
  // CVV
  drawLtr(p4, "***", 200, 280, latFont, 9);

  // רחוב
  drawHebrew(p4, "הרצל", 530, 258, hebFont, 9);
  // מס'
  drawLtr(p4, "1", 415, 258, latFont, 9);
  // יישוב
  drawHebrew(p4, "תל אביב", 355, 258, hebFont, 9);
  // מיקוד
  drawLtr(p4, "6100000", 200, 258, latFont, 9);

  // טלפון
  drawLtr(p4, "050-1234567", 475, 237, latFont, 9);
  // טלפון נייד
  drawLtr(p4, "050-1234567", 305, 237, latFont, 9);

  // חתימת בעל הכרטיס - תאריך
  drawLtr(p4, "14/02/2026", 130, 84, latFont, 8);

  // Embed signature image if available
  // For test, draw a placeholder text
  drawHebrew(p4, "[חתימה]", 200, 434, hebFont, 9, rgb(0.2, 0.2, 0.8));

  // Save
  const filledBytes = await doc.save();
  writeFileSync(join(process.cwd(), "scripts", "test-filled.pdf"), filledBytes);
  console.log("✅ Filled PDF saved to scripts/test-filled.pdf");
  console.log("Size:", (filledBytes.length / 1024).toFixed(1), "KB");
}

main().catch(console.error);
