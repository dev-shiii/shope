import Product from "../models/Product.js";

/* GET ALL PRODUCTS */
export const getProducts = async (req, res) => {
  const products = await Product.find();
  res.json({ products });
};

/* GET PRODUCT BY ID */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: "Invalid product ID" });
  }
};

/* ADD PRODUCT */
export const addProduct = async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  res.json({ message: "Product added", product: newProduct });
};

/* DELETE PRODUCT */
export const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
};

/* HAVERSINE */
function haversine(lat1, lon1, lat2, lon2) {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* GET NEARBY PRODUCTS */
export const getNearbyProducts = async (req, res) => {
  try {
    const { lat, lng, radiusKm = 50 } = req.query;

    if (!lat || !lng)
      return res.status(400).json({ message: "Latitude & longitude required" });

    const products = await Product.find();

    const nearby = products
      .map((p) => {
        if (!p.location) return null;

        const dist = haversine(
          Number(lat),
          Number(lng),
          p.location.lat,
          p.location.lng
        );

        return { ...p._doc, distance: Number(dist.toFixed(2)) };
      })
      .filter((p) => p && p.distance <= Number(radiusKm));

    res.json({ products: nearby });
  } catch (err) {
    console.error("Nearby product error:", err);
    res.status(500).json({ message: "Failed to fetch nearby products" });
  }
};
