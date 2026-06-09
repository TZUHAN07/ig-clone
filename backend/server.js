require("dotenv").config();
const http = require("http");
const mongoose = require("mongoose");
const app = require("./app");
const { initSocket } = require("./config/socket");

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
initSocket(server);

const user = process.env.MONGO_USER;
const pass = process.env.MONGO_PASS;
const cluster = process.env.MONGO_CLUSTER;
const dbName = process.env.MONGO_DB;

const dbURI = `mongodb+srv://${user}:${pass}@${cluster}/${dbName}?retryWrites=true&w=majority&appName=igclone`;

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log("Connected to mongoDB");

    server.listen(PORT, () => {
      console.log("Server is running on port", PORT);
    });
  } catch (err) {
    console.error("disconnected to mongoDB", err);
    throw err;
  }
};

connectDB();
