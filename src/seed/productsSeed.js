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
    category: "electronics",
    location: { lat: 19.7515, lng: 75.7139 }
  },
  {
    name: "Smart Watch",
    description: "Feature-rich smartwatch with fitness tracking",
    price: 249.99,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    category: "electronics",
    location: { lat: 19.7515, lng: 75.7139 }
  },
  {
    name: "Bluetooth Speaker",
    description: "Portable Bluetooth speaker with deep bass",
    price: 39.99,
    image:
      "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=800&q=80",
    category: "electronics",
    location: { lat: 19.7515, lng: 75.7139 }
  },
  {
    name: "Laptop Stand",
    description: "Ergonomic aluminum laptop stand for better posture",
    price: 34.99,
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80",
    category: "electronics",
    location: { lat: 19.7515, lng: 75.7139 }
  },
  {
    name: "Mechanical Keyboard",
    description: "RGB mechanical keyboard with blue switches",
    price: 129.99,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    category: "electronics",
    location: { lat: 19.7515, lng: 75.7139 }
  },
  {
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse with long battery life",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    category: "electronics",
    location: { lat: 19.7515, lng: 75.7139 }
  },
  {
    name: "USB-C Hub",
    description: "6-in-1 USB-C hub with HDMI and SD card reader",
    price: 45.99,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
    category: "electronics",
    location: { lat: 19.7515, lng: 75.7139 }
  },
  {
    name: "Olive Oil",
    description: "Extra virgin olive oil for cooking & dressing",
    price: 15.99,
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
    category: "grocery",
    location: { lat: 19.7515, lng: 75.7139 }
  },
  {
    name: "Ceramic Bowl Set",
    description: "Set of 6 microwave-safe ceramic bowls",
    price: 29.99,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
    category: "kitchen",
    location: { lat: 19.7515, lng: 75.7139 }
  },
  {
    name: "Wooden Chair",
    description: "Solid wood chair with comfortable seat",
    price: 59.99,
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80",
    category: "furniture",
    location: { lat: 19.7515, lng: 75.7139 }
  },
  {
    name: "Office Table",
    description: "Spacious office table with storage",
    price: 129.99,
    image:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
    category: "furniture",
    location: { lat: 19.7515, lng: 75.7139 }
  },
  {
    name: "Running Shoes",
    description: "Comfortable running shoes for everyday use",
    price: 59.99,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    category: "fashion",
    location: { lat: 19.7515, lng: 75.7139 }
  },
  {
    name: "Leather Backpack",
    description: "Durable leather backpack for travel",
    price: 79.99,
    image:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800",
    category: "fashion",
    location: { lat: 19.7515, lng: 75.7139 }
  },
  {
    name: "Face Moisturizer",
    description: "Hydrating daily face moisturizer",
    price: 11.99,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
    category: "beauty",
    location: { lat: 19.7515, lng: 75.7139 }
  },
  {
    name: "Yoga Mat",
    description: "Non-slip yoga mat with extra cushioning",
    price: 19.99,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
    category: "sports",
    location: { lat: 19.7515, lng: 75.7139 }
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
