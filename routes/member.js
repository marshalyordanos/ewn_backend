const router = require("express").Router();
const Member = require("../model/member");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/img");
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".")[1];
    cb(null, `user-${uuidv4()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  cb(null, true);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const uploadUserPhoto = upload.single("photo");

// regsiter member
router.route("/addmember").post(
  uploadUserPhoto,
  catchAsync(async (req, res, next) => {
    console.log(req?.file);
    if (req?.file) {
      req.body.photo = "/img/" + req.file.filename;
    }
    const x = await Member.findOne({ email: req.body.email });
    if (x) {
      return next(new AppError("user is already exist!", 400));
    }
    const y = await Member.findOne({ username: req.body.username });
    if (y) {
      return next(new AppError("user is already exist!", 400));
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPass;

    const newMember = Member.create(req.body);
    // const user = await newMember.save();
    res.status(200).json({ newMember });
  })
);

router.route("/addmember/:id").patch(
  catchAsync(async (req, res) => {
    const newMember = await Member.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    console.log(newMember);

    res.status(200).json({ newMember });
  })
);

router.route("/sendEmail").post(
  catchAsync(async (req, res) => {
    let uid = req.body.ids;

    let mailTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "marshalyordanos32@gmail.com",
        pass: "fvcfrdfpevpcpgop",
      },
    });
    let t = false;

    for (let i = 0; i < uid.length; i++) {
      const user = await Member.findById(uid[i]);
      console.log("wwwwwwwwwwwwwww", user.email);

      let info = {
        from: "marshalyordanos32@gmail.com",
        to: user.email,
        subject: "Ewien Membership message",
        text: req.body.content,
      };
      console.log(req.body);
      mailTransporter.sendMail(info, (err) => {
        if (err) {
          console.log("eeerrrrrrrrrrrrrrrrrrr", err);
          t = true;
        } else {
          console.log("yessssssssssssss");
          t = false;
          return;
        }
      });
    }

    if (t) {
      res.status(200).json({ res: "done" });
    } else {
      res.status(200).json({ res: "fail" });
    }
  })
);
router.get(
  "/",
  catchAsync(async (req, res) => {
    const users = await Member.find().populate("payments");
    res.status(200).json({ user: users });
  })
);
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const id = req.params.id;

    const users = await Member.findById(id);
    res.status(200).json({ user: users });
  })
);

router.get("/deleteAll", async (req, res) => {
  try {
    const users = await Member.deleteMany({ username: { $ne: "kkkk" } });
    res.status(200).json({ user: users });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
