const express = require("express");
const Category = require("../models/categories");
const routerCtgr = express.Router();

routerCtgr.get("/categories", async (req, res) => {
  let skip = (req.query.page - 1) * req.query.take || 0;
  let take = req.query.take || 100;  
  const categories = await Category.find().skip(skip).limit(take).exec();
  console.log(categories);
  res.send(categories);
});
routerCtgr.post("/categories", async (req, res) => {
  const category = new Category(req.body);
  await category.save();
  res.send(category);
  console.log(category);
});
routerCtgr.get("/categories/:id", async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id).exec();
  console.log("id", id);
  console.log("ctgr", category);
  res.send(category);
});
routerCtgr.put("/categories/:id", async (req, res) => {
  const { id } = req.params;
  const category = await Category.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.send(category);
  console.log("updated", category);
});
routerCtgr.delete("/categories/:id", async (req, res) => {
  const { id } = req.params;
  const category = await Category.findByIdAndDelete(id);
  res.send(category);
  console.log("deleted", category);
});
module.exports = routerCtgr;
