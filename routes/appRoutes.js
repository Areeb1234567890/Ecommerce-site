const express = require("express");
const Route = express.Router();
const { Register, Login } = require("../controller/authController");
const {
  Order,
  GetOrder,
  GetUserOrders,
} = require("../controller/orderController");
const {
  getProduct,
  addProduct,
  deleteProduct,
} = require("../controller/productController");
const { getUserData } = require("../controller/userController");
const multer = require("multer");
const storage = multer.memoryStorage();
const uploads = multer({ storage });

Route.post("/register", Register);
Route.post("/login", Login);
Route.post("/orderProduct", Order);
Route.get("/getOrder", GetOrder);
Route.get("/getUserOrder/:id", GetUserOrders);
Route.post("/addProduct", uploads.single("file"), addProduct);
Route.get("/getProducts", getProduct);
Route.delete("/deleteProduct/:id", deleteProduct);
Route.get("/getUsers", getUserData);

module.exports = Route;
