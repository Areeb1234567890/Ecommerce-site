const orderModel = require("../models/orderModel");

const Order = async (req, res) => {
  const {
    productId,
    userId,
    orderQuantity,
    totalPrice,
    house,
    street,
    city,
    province,
    country,
  } = req.body;

  if (!house || !street || !city || !province || !country) {
    return res.status(400).json({ msg: "incomplete address" });
  }

  const newSchema = new orderModel({
    user: userId,
    product: productId,
    quantity: orderQuantity,
    totalPrice,
    address: {
      house,
      street,
      city,
      province,
      country,
    },
  });

  try {
    await newSchema.save();
    res.status(201).json({ msg: "Orderd successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ msg: "try again" });
  }
};

const GetOrder = async (req, res) => {
  try {
    const orders = await orderModel
      .find()
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "product",
      });

    if (!orders) {
      return res.status(404).json({ msg: "data not found" });
    }
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const GetUserOrders = async (req, res) => {
  try {
    const user = req.params.id;
    const orders = await orderModel
      .find({ user })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "product",
      });
    if (orders.length === 0) {
      return res.status(404).json({ msg: "No order found" });
    }
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deliverOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const orderExist = await orderModel.findById(orderId);
    if (!orderExist) {
      return res.status(404).json({ msg: "product not found" });
    }
    await orderModel.findByIdAndUpdate(orderId, req.body, {
      new: true,
    });
    res.status(200).json({ msg: "Order dispatched successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { Order, GetOrder, GetUserOrders, deliverOrder };
