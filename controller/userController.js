const userModel = require("../models/userModel");

const getUserData = async (req, res) => {
  try {
    const userDocs = await userModel.find();

    if (userDocs.length === 0) {
      return res.status(404).json({ msg: "No users found" });
    }

    const user = userDocs.map((user) => {
      const { password, ...userWithoutPassword } = user.toObject();
      return userWithoutPassword;
    });

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = { getUserData };
