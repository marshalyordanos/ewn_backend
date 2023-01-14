//---- step : 1.1
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

//---- step : 3
const multer = require("multer");

//---- step : 2.1
const authRoute = require("./routes/auth");
const authPost = require("./routes/posts");
const authMember = require("./routes/member");
const authUser = require("./routes/user");
const authCat = require("./routes/categories");
const path = require("path");
const AppError = require("./utils/appError");
const { errHandling } = require("./utils/errorhandler");

const publicDirectoryPath = path.join(__dirname, "/public");

//---- step : 1
dotenv.config();
//---- step : 2.2
app.use(cors());
app.use(express.json());
//---- step : 2.3 last ma file crate garne time
app.use(express.static(publicDirectoryPath));

//---- step : 1.3
mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.use("/auth", authRoute);
app.use("/users", authUser);
app.use("/members", authMember);
app.use("/posts", authPost);
app.use("/category", authCat);

app.all("*", (req, res, next) => {
  return next(new AppError("Page is not found kkkkkkkk", 404));
});
app.use(errHandling);

//---- step : 1.2
app.listen("5000", () => {
  console.log("backend running...");
});
