require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Post = require("./models/post");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const user = process.env.MONGO_USER;
const pass = process.env.MONGO_PASS;
const cluster = process.env.MONGO_CLUSTER;
const dbName = process.env.MONGO_DB;

const dbURI = `mongodb+srv://${user}:${pass}@${cluster}/${dbName}?retryWrites=true&w=majority&appName=igclone`;

const connect = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log("Connected to mongoDB");
  } catch (err) {
    console.log("disconnected to mongoDB");
    throw err;
  }
};

connect();

app.get("/",(req, res) => {
    res.json({ message: "IG clone API is running" });
})
app.post("/api/posts", async (req, res) => {
  try {
    const { user, content, image } = req.body;

    const newPost = new Post({
      user,
      content,
      image,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ message: err.message})
  }
});



app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
