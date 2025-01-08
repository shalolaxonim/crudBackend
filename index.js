console.log("hello hmw");

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const routerCtgr = require("./routes/categories");
const routerProd = require("./routes/products");
const routerMulter = require("./multer");
const routerRegister = require("./routes/registration");
const routerLogin = require("./routes/login");
const routerUser = require("./routes/user");

const app = express();
app.use(express.json());

const url =
  "mongodb+srv://shalolaxonyoqubjonova:shalolaxon1010@cluster0.1su5f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(url)
  .then(() => {
    console.log("connected to db");
  })
  .catch((e) => {
    console.log(e, "error");
  });

const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
app.use(cors({ origin: allowedOrigins }));
app.use(routerCtgr);
app.use(routerProd);
app.use(routerMulter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(routerRegister);
app.use(routerLogin);
app.use(routerUser);

app.listen(3000, () => {
  console.log("server started in 3000 port");
});
