import nodemailer from "nodemailer";
import path from "path";

const sendInvoiceEmail = async (to, invoicePath) => {
  try {
    console.log("📧 Preparing invoice email (Nodemailer)...");
    console.log(" ➤ To:", to);
    console.log(" ➤ Invoice Path:", invoicePath);

    // 1. Create the email transporter using Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 2. Set up who the email is to, from, and the attached PDF
    const mailOptions = {
      from: `"ShopEasy" <${process.env.EMAIL_USER}>`, // Looks professional!
      to: to,
      subject: "Your Order Invoice - ShopEasy",
      text: "Thank you for your order! Your invoice is attached to this email.",
      attachments: [
        {
          filename: path.basename(invoicePath),
          path: invoicePath, // Nodemailer reads the file directly!
          contentType: "application/pdf",
        },
      ],
    };

    // 3. Send the email!
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Invoice email sent successfully (Nodemailer) ID:", info.messageId);
    
    return info;
  } catch (error) {
    console.error("❌ Nodemailer Email Error:", error.message);
    throw error;
  }
};

export default sendInvoiceEmail;