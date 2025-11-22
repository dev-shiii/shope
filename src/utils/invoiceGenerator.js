import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const generateInvoice = (order, invoicePath) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40 });

      const stream = fs.createWriteStream(invoicePath);
      doc.pipe(stream);

      // -------------------------------
      // HEADER
      // -------------------------------
      doc
        .fontSize(26)
        .text("ShopEasy Invoice", { align: "center" })
        .moveDown(1);

      doc
        .fontSize(14)
        .text(`Invoice ID: ${order._id}`)
        .text(`Order Date: ${new Date(order.createdAt).toLocaleString()}`)
        .moveDown(1);

      // -------------------------------
      // CUSTOMER INFORMATION
      // -------------------------------
      doc
        .fontSize(18)
        .text("Customer Details:")
        .moveDown(0.5);

      doc
        .fontSize(14)
        .text(`Name: ${order.shippingAddress.fullName}`)
        .text(`Phone: ${order.shippingAddress.phone}`)
        .moveDown(1);

      // -------------------------------
      // SHIPPING ADDRESS
      // -------------------------------
      doc.fontSize(18).text("Shipping Address:").moveDown(0.5);

      doc
        .fontSize(14)
        .text(order.shippingAddress.street)
        .text(`${order.shippingAddress.city}, ${order.shippingAddress.state}`)
        .text(`Pincode: ${order.shippingAddress.pincode}`)
        .moveDown(1);

      // -------------------------------
      // PRODUCT TABLE HEADER
      // -------------------------------
      doc
        .fontSize(18)
        .text("Items:", { underline: true })
        .moveDown(0.5);

      doc
        .fontSize(14)
        .text("Product Name", 50, doc.y)
        .text("Qty", 300, doc.y)
        .text("Price", 350, doc.y)
        .text("Total", 430, doc.y);

      doc.moveTo(40, doc.y + 5).lineTo(550, doc.y + 5).stroke().moveDown(1);

      // -------------------------------
      // PRODUCT LOOP
      // -------------------------------
      order.items.forEach((item) => {
        doc
          .fontSize(14)
          .text(item.productId.name, 50, doc.y)
          .text(item.quantity, 300, doc.y)
          .text(`₹${item.price}`, 350, doc.y)
          .text(`₹${item.quantity * item.price}`, 430, doc.y)
          .moveDown(0.7);
      });

      doc.moveDown(1);

      // -------------------------------
      // TOTAL SECTION
      // -------------------------------
      doc
        .fontSize(16)
        .text(`Total Amount: ₹${order.totalAmount}`, { align: "right" })
        .moveDown(2);

      // -------------------------------
      // FOOTER
      // -------------------------------
      doc
        .fontSize(12)
        .text("Thank you for shopping with ShopEasy!", {
          align: "center",
        })
        .moveDown(0.5);

      doc.text("This is a computer-generated invoice.", {
        align: "center",
      });

      doc.end();

      stream.on("finish", resolve);
      stream.on("error", reject);
    } catch (err) {
      reject(err);
    }
  });
};

export default generateInvoice;
