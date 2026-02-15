// ── Email Configuration ──
// Addresses for form submission

export const EMAIL_CONFIG = {
  // גארדיאן - כתובת ייעודית לביטוח נסיעות שנתי
  // PRODUCTION: yearly.travel.insurance@grdn.co.il
  // DEV: dror@grdn.co.il (Resend free tier sends only to account email)
  guardian: process.env.NODE_ENV === "production"
    ? "yearly.travel.insurance@grdn.co.il"
    : "dror@grdn.co.il",

  // הראל - להפקת פוליסה
  // TODO: לעדכן לכתובת הראל האמיתית לאחר השקה (fax7922@harel-ins.co.il)
  harel: process.env.NODE_ENV === "production"
    ? "yearly.travel.insurance@grdn.co.il"
    : "dror@grdn.co.il",

  // נושא המייל
  subjectTemplate: (customerName: string, idNumber: string) =>
    `טופס הצעה לביטוח נסיעות פירסט קלאס - ${customerName} - ת.ז. ${idNumber}`,
};

// ── Agent Configuration ──
export const AGENT_CONFIG = {
  agentName: "דרור אדרי",
  agentNumber: "", // TODO: להוסיף מספר סוכן
  agencyName: "גארדיאן סוכנות לביטוח",
};

// ── API Configuration ──
export const API_CONFIG = {
  sureance: {
    baseUrl: "https://api.surense.com/api/v1",
    // TODO: להוסיף credentials
    clientId: "",
    clientSecret: "",
  },
};
