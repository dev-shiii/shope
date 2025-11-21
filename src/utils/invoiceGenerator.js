import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const generateInvoice = (order, invoicePath) => {
  console.log("🧾 Generating invoice at:", invoicePath);
  console.log("📌 Order ID:", order._id);

  return new Promise((resolve, reject) => {
    try {
      // Correct invoice folder
      const folder = path.join(process.cwd(), "src", "invoices");

      if (!fs.existsSync(folder)) {
        console.log("📁 invoices folder missing — creating it");
        fs.mkdirSync(folder, { recursive: true });
      }

      const doc = new PDFDocument({ margin: 40 });
      const stream = fs.createWriteStream(invoicePath);

      doc.pipe(stream);

      // PDF contents
      doc.fontSize(20).text("INVOICE", { align: "center" });
      doc.moveDown();

      doc.fontSize(12).text(`Order ID: ${order._id}`);
      doc.moveDown();

      // End document
      doc.end();

      stream.on("finish", () => {
        console.log("✔ Invoice generated successfully!");
        resolve();
      });

      stream.on("error", (e) => {
        console.log("❌ Invoice generation error:", e);
        reject(e);
      });

    } catch (err) {
      console.log("❌ PDF Generator crashed:", err);
      reject(err);
    }
  });
};

export default generateInvoice;
