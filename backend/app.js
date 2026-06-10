const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { apiLimiter } = require("./middleware/rateLimiters");
const { errorHandler } = require("./middleware/errorHandler");

const postRoute = require("./routes/postRoutes");
const authRoute = require("./routes/authRoutes");
const userRoute = require("./routes/userRoutes");
const messageRoute = require("./routes/messageRoutes");

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use("/posts", apiLimiter, postRoute);
app.use("/", authRoute);
app.use("/users", apiLimiter, userRoute);
app.use("/messages", apiLimiter, messageRoute);

app.use(errorHandler);

module.exports = app;