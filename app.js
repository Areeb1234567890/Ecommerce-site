require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connectToDb = require("./config/db");
const authenticateToken = require("./middlewares/auth");
const checkAdmin = require("./middlewares/admin");
const Route = require("./routes/appRoutes");
const Uri = process.env.MONGO_URI;
const port = process.env.PORT;

connectToDb(Uri);
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
// app.use(authenticateToken);
// app.use(checkAdmin);
app.use("/api", Route);

app.get("/", (req, res) => {
  res.send("Api is running....");
});

app.listen(`${port}`, () => {
  console.log(`Server started at port ${port}`);
});
