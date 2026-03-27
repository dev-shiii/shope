import nodemailer from "nodemailer";
import path from "path";
import dns from "dns"; // 🌟 IMPORT NODE'S BUILT-IN DNS MODULE

// 🌟 FIX: Force Node to use standard IPv4 to prevent Render's ENETUNREACH crash
dns.setDefaultResultOrder("ipv4first");

const sendInvoiceEmail = async (to, invoicePath) => {
  try {
    console.log("📧 Preparing invoice email (Nodemailer)...");
    console.log(" ➤ To:", to);
    console.log(" ➤ Invoice Path:", invoicePath);

    // Swap 'service: gmail' for explicit host settings to be extra safe
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"ShopEasy" <${process.env.EMAIL_USER}>`, 
      to: to,
      subject: "Your Order Invoice - ShopEasy",
      text: "Thank you for your order! Your invoice is attached to this email.",
      attachments: [
        {
          filename: path.basename(invoicePath),
          path: invoicePath, 
          contentType: "application/pdf",
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Invoice email sent successfully! ID:", info.messageId);
    
    return info;
  } catch (error) {
    console.error("❌ Nodemailer Email Error:", error.message);
    throw error;
  }
};

export default sendInvoiceEmail;