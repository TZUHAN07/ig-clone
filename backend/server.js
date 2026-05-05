require("dotenv").config();
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { initSocket } = require("./config/socket");
const rateLimit = require("express-rate-limit");

const postRoute = require("./routes/postRoutes");
const authRoute = require("./routes/authRoutes");
const userRoute = require("./routes/userRoutes");

const app = express();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "嘗試次數過多，請 15 分鐘後再試",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "請求過於頻繁，請稍後再試",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use("/", authLimiter);
app.use("/posts", apiLimiter);
app.use("/users", apiLimiter);

app.use("/posts", postRoute);
app.use("/", authRoute);
app.use("/users", userRoute);

const server = http.createServer(app);
initSocket(server);

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

server.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
