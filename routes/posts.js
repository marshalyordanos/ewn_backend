const router = require("express").Router();
const Post = require("../model/post");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const Member = require("../model/member");
const Payment = require("../model/Payment");

const multerStorage2 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    let ext = file.originalname.split(".")[1];
    if (!ext) {
      ext = "webm";
    }
    cb(null, `user-${uuidv4()}-${Date.now()}.${ext}`);
  },
});

/******************** multer fields ************************ */
const multerFilter2 = (req, file, cb) => {
  cb(null, true);
};
const upload2 = multer({
  storage: multerStorage2,
  fileFilter: multerFilter2,
});
const uploadUserPhoto2 = upload2.fields([
  { name: "photo", maxCount: 100 },
  { name: "video", maxCount: 100 },
]);

//create post

router.get("/getpayments", async (req, res) => {
  // const id = req.params.id;
  console.log("pppppppppppppp");
  try {
    let user = await Payment.find();

    res.status(200).json(user);
  } catch (error) {
    res.status(404).json(error);
  }
});
router.get("/getpayment/:id", async (req, res) => {
  console.log("------------------------------");

  const id = req.params.id;
  try {
    let user = await Payment.find({ user: id });

    res.status(200).json(user);
  } catch (error) {
    res.status(404).json(error);
  }
});

router.post("/", uploadUserPhoto2, async (req, res) => {
  console.log("=====================================", req.files);
  if (req.files?.video) {
    req.body.video = "/images/" + req.files.video[0].filename;
  }
  if (req.files?.photo) {
    req.body.photo = "/images/" + req.files.photo[0].filename;
  }
  try {
    console.log("****************", req.body);
    const newPost = await Post.create(req.body);
    console.log("ppppppp", newPost);
    res.status(200).json(newPost);
  } catch (error) {
    res.status(500).json(error);
  }
});
/* 
{
    "username":"admin",
    "title":"test5",
    "desc":"loreme2"
} */

// update post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        const updatePost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatePost);
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      res.status(401).json("You can update only your post!");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// delete
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        await post.delete();
        res.status(200).json("Post Has been delete!");
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      res.status(401).json("You can delete only your post!");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// get post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json(error);
  }
});

// get all post
router.get("/", async (req, res) => {
  const username = req.query.user;
  const catName = req.query.cat;
  try {
    let posts;
    if (username) {
      posts = await Post.find({ username: username });
    } else if (catName) {
      posts = await Post.find({
        categories: {
          $in: [catName],
        },
      });
    } else {
      posts = await Post.find();
    }
    res.status(200).json(posts);
  } catch (error) {
    res.status(404).json(error);
  }
});

router.post("/payment/:id", async (req, res) => {
  const id = req.params.id;
  // const uid = req.params.uid;

  console.log("--------------==========-", id);
  try {
    // let user = await Member.findById(id);

    req.body.user = id;
    let payments1 = await Payment.create(req.body);
    // console.log("log", payments);
    const user = await Member.findById(id);

    const user2 = await Member.findByIdAndUpdate(id, {
      payments: [payments1._id, ...user.payments],
    });
    console.log("[[[[[[[[[[[[[[[[[[[[[[[[[[[", user2);
    res.status(200).json(payments1);
  } catch (error) {
    res.status(404).json(error);
  }
});

router.patch("/payment/:id", async (req, res) => {
  const id = req.params.id;
  console.log("------------=====88888--==========-", req.body);
  try {
    // let user = await Member.findById(id);

    let payments1 = await Payment.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(payments1);
  } catch (error) {
    res.status(404).json(error);
  }
});

//localhost:5000/posts?user=ram

module.exports = router;
