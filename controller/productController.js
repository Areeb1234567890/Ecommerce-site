require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const productModel = require("../models/productsModel");

cloudinary.config({
  cloud_name: `${process.env.CLOUDINARY_NAME}`,
  api_key: `${process.env.CLOUDINARY_API_KEI}`,
  api_secret: `${process.env.CLOUDINARY_SECRET}`,
});

const addProduct = async (req, res) => {
  const { title, description, price, brand, quantity } = req.body;
  const file = req.file;

  if (!title || !description || !price || !brand) {
    return res.status(500).json({ msg: "Please provide all required fields" });
  }
  if (!file) {
    return res.status(500).json({ msg: "Please upload a file" });
  }

  try {
    const result = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${file.buffer.toString("base64")}`
    );
    const imageUrl = result.secure_url;

    await productModel.create({
      title,
      description,
      price,
      brand,
      qty: quantity,
      image: imageUrl,
    });

    res.status(200).json({ msg: "post added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProduct = async (req, res) => {
  const products = await productModel.find();
  if (!products) {
    return res.status(404).json({ msg: "no data available" });
  }
  res.status(200).json({ products });
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const productExist = await productModel.findById(productId);
    if (!productExist) {
      return res.status(404).json({ msg: "Product not found" });
    }

    const publicId = productExist.image.split("/").pop().split(".")[0];

    await cloudinary.uploader.destroy(publicId);

    await productModel.findByIdAndDelete(productId);
    res.status(200).json({ msg: "Data deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addProduct, getProduct, deleteProduct };
