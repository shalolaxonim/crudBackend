const mongoose = require("mongoose");
const CategorySchema = new mongoose.Schema({
  name: String,
  image: String,
  date: {
    type: Date,
    default: Date.now,
  },
});
const Category = mongoose.model("Categorylar", CategorySchema);

module.exports = Category;
