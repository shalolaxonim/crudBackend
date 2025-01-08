const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema({
  name: String,
  color: String,
  price: Number,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categorylar",
  },
  image: String,
  date: {
    type: Date,
    default: Date.now,
  },
});
ProductSchema.pre("save", function (next) {
  if (this.date) {
    const uzbekistanOffset = 5 * 60;
    const localDate = new Date(this.date);
    localDate.setMinutes(localDate.getMinutes() + uzbekistanOffset);
    this.date = localDate;
  }
  next();
});
const Product = mongoose.model("Productlar", ProductSchema);

module.exports = Product;
