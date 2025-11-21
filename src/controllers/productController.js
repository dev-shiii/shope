import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
  const products = await Product.find();
  res.json({ products });
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);

  } catch (err) {
    res.status(400).json({ message: "Invalid product ID" });
  }
};

export const addProduct = async (req, res) => {
  const { name, price, description, image } = req.body;

  const newProduct = new Product({
    name,
    price,
    description,
    image
  });

  await newProduct.save();

  res.json({ message: "Product added", product: newProduct });
};

export const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
};

