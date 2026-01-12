require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Post = require('./models/post');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected.");
  })
  .catch((err) => {
    console.log("MongoDB connection error;", err.message);
  });

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
