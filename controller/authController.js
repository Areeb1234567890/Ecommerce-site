require("dotenv").config();
const userSchema = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = `${process.env.SECRET_KEY}`;

const Register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(404).json({ msg: "incomplete information error" });
  }
  const userexist = await userSchema.findOne({ email });
  if (userexist) {
    return res
      .status(501)
      .json({ msg: "User already exists with this email." });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new userSchema({
    name,
    email,
    password: hashedPassword,
    isAdmin: true,
  });
  try {
    await newUser.save();
    res.status(201).json({ msg: "User registerd successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(400).json({ msg: "try again" });
  }
};

const Login = async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await userSchema.findOne({ email });
  if (!userDoc) {
    return res.status(400).json({ msg: "User not found" });
  }
  const passwordCheck = bcrypt.compareSync(password, userDoc.password);
  if (passwordCheck) {
    jwt.sign({ _id: userDoc._id }, secret, {}, (error, token) => {
      if (error) throw Error(error);
      let user = userDoc.toObject();
      delete user.password;
      res.json({ user, success: true, token, msg: "Logged in successfully" });
    });
  } else {
    res.status(400).json({ msg: "wrong credentials" });
  }
};

module.exports = { Register, Login };
