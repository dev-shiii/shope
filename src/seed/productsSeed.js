import mongoose from "mongoose";
import Product from "../models/Product.js";
import dotenv from "dotenv";

dotenv.config();

const products = [
  {
    name: "Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    price: 99.99,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    category: "electronics"
  },
  {
    name: "Smart Watch",
    description: "Feature-rich smartwatch with fitness tracking",
    price: 249.99,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    category: "electronics"
  },
  {
    name: "Bluetooth Speaker",
    description: "Portable Bluetooth speaker with deep bass",
    price: 39.99,
    image:
      "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=800&q=80",
    category: "electronics"
  },
  {
    name: "Laptop Stand",
    description: "Ergonomic aluminum laptop stand for better posture",
    price: 34.99,
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80",
    category: "electronics"
  },
  {
    name: "Mechanical Keyboard",
    description: "RGB mechanical keyboard with blue switches",
    price: 129.99,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    category: "electronics"
  },
  {
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse with long battery life",
    price: 24.99,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    category: "electronics"
  },
  {
    name: "USB-C Hub",
    description: "6-in-1 USB-C hub with HDMI and SD card reader",
    price: 45.99,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
    category: "electronics"
  },
  {
    name: "Olive Oil",
    description: "Extra virgin olive oil for cooking & dressing",
    price: 15.99,
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
    category: "grocery"
  },
  {
    name: "Ceramic Bowl Set",
    description: "Set of 6 microwave-safe ceramic bowls",
    price: 29.99,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
    category: "kitchen"
  },
  {
    name: "Wooden Chair",
    description: "Solid wood chair with comfortable seat",
    price: 59.99,
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80",
    category: "furniture"
  },
  {
    name: "Office Table",
    description: "Spacious office table with storage",
    price: 129.99,
    image:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
    category: "furniture"
  },
  {
    name: "Running Shoes",
    description: "Comfortable running shoes for everyday use",
    price: 59.99,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    category: "fashion"
  },
  {
    name: "Leather Backpack",
    description: "Durable leather backpack for travel",
    price: 79.99,
    image:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800",
    category: "fashion"
  },
  {
    name: "Face Moisturizer",
    description: "Hydrating daily face moisturizer",
    price: 11.99,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
    category: "beauty"
  },
  {
    name: "Yoga Mat",
    description: "Non-slip yoga mat with extra cushioning",
    price: 19.99,
    image:
      "data:image/jpeg;base64,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",
    category: "sports"
  }
];



async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected!");

    await Product.deleteMany();
    console.log("Old products removed.");

    await Product.insertMany(products);
    console.log("Sample products inserted!");

    process.exit();
  } catch (err) {
    console.log("Error:", err.message);
    process.exit(1);
  }
}

seedProducts();
