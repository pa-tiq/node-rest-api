const express = require("express");
const { body } = require("express-validator");

const feedController = require("../controllers/feed_controller");

const router = express.Router();

router.get("/posts", feedController.getPosts); // GET /feed/posts

router.get("/post:postid", feedController.getPost);

router.post(
  "/post",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.createPost
); // POST /feed/post

module.exports = router;
