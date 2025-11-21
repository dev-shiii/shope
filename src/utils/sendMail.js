// src/utils/sendMail.js
import sgMail from "@sendgrid/mail";
import fs from "fs";
import path from "path";

if (!process.env.SENDGRID_API_KEY) {
  console.error("❌ Missing SENDGRID_API_KEY in environment");
} else {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const sendInvoiceEmail = async (to, invoicePath) => {
  try {
    console.log("📧 Preparing invoice email (SendGrid)...");
    console.log(" ➤ To:", to);
    console.log(" ➤ Invoice Path:", invoicePath);

    const attachment = fs.readFileSync(invoicePath).toString("base64");

    const msg = {
      to,
      from: process.env.FROM_EMAIL, // verified sender
      subject: "Your Order Invoice",
      text: "Thank you for your order! Your invoice is attached.",
      attachments: [
        {
          content: attachment,
          filename: path.basename(invoicePath),
          type: "application/pdf",
          disposition: "attachment",
        },
      ],
    };

    const response = await sgMail.send(msg);
    console.log("✅ Invoice email sent successfully (SendGrid)");
    return response;
  } catch (error) {
    console.error("❌ SendGrid Email Error:", error && error.message);
    if (error && error.response) console.error("➡ SendGrid response:", error.response.body);
    throw error;
  }
};

export default sendInvoiceEmail;
