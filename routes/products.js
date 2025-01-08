const express = require("express");
const Product = require("../models/products");
const mongoose = require("mongoose");
const routerProd = express.Router();
const moment = require('moment-timezone');

routerProd.get("/products", async (req, res) => {
  let skip = (req.query.page - 1) * req.query.take || 0;
  let take = req.query.take || 100;
  let { color, priceMin, priceMax, dateMin, dateMax, category } = req.query;
  try {
    let query = {};
    if (color) {
      query.color = color;
    }
    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) query.price.$gte = parseFloat(priceMin);
      if (priceMax) query.price.$lte = parseFloat(priceMax);
    }
    if (dateMin || dateMax) {
      query.date = {};
      if (dateMin) query.date.$gte = new Date(dateMin);
      if (dateMax) query.date.$lte = new Date(dateMax);
    }
    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.category = category;
      } else {
        return res.status(400).json({ message: "Invalid category id" });
      }
    }
    const products = await Product.find(query)
      .skip(skip)
      .limit(take)
      .populate("category")
      .exec();
    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }
    //
    products.forEach(product => {
      const localDate = moment(product.date).tz('Asia/Tashkent').format('dddd, MMMM D, YYYY, HH:mm:ss');
      product.date = localDate;
    });
    //
    return res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
});
//

routerProd.post("/products", async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct
    .save()
    .then((product) => res.status(201).json(product))
    .catch((err) =>
      res.status(500).json({ message: "Failed to create product", error: err })
    );
});
routerProd.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id).exec();
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
});
routerProd.put("/products/:id", async (req, res) => {
  try {
    const { name, image, price, color, category } = req.body;
    const { id } = req.params;
    const validCategory =
      category && mongoose.Types.ObjectId.isValid(category) ? category : null;
    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required" });
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        image,
        price,
        color,
        category: validCategory,
      },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
routerProd.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});
module.exports = routerProd;
