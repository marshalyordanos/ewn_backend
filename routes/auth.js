const router = require("express").Router();
const User = require("../model/user");
const Member = require("../model/member");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const AppError = require("../utils/appError");
const getToken = (id) => {
  console.log("hahahahahahahahahahahahha");
  return jwt.sign({ id: id }, "kjajsnjknnk", {
    expiresIn: "30d",
  });
};
// regsiter
router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    const newUser = new Member({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
      admin: true,
    });

    const user = await newUser.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

// login

router.post("/login", async (req, res) => {
  try {
    const user = await Member.findOne({ username: req.body.username });
    //if no user
    console.log("++++++++++", user, req.body.username);
    if (!user) {
      return next(new AppError("invalid password and email!"));
    }

    //if same user then compare password
    const validate = await bcrypt.compare(req.body.password, user.password);
    //if not validate
    if (!validate) {
      return next(new AppError("invalid password and email!"));
    }

    const { password, ...other } = user._doc;
    console.log("******************************");
    const token = getToken(user._id);
    console.log("===================================");
    res.status(200).json({ token, user: other });
  } catch (error) {
    res.status(500).json(error);
  }
});
module.exports = router;
