const { validationResult } = require("express-validator");

const Post = require("../models/post");

exports.getPosts = (req, res, next) => {
  // 200 = success
  res.status(200).json({
    posts: [
      {
        _id: "1",
        title: "oieeeee",
        content: "diaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        imageUrl: "images/pepe.jpg",
        creator: {
          name: "Zé Buceta",
        },
        createdAt: new Date(),
      },
    ],
  });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Validation failed, entered data is incorrect",
      errors: errors.array(),
    });
  }
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
    title: title,
    content: content,
    imageUrl: 'images/pepe.jpg',
    creator: { name: "patiq" },
  });
  post
    .save()
    .then((result) => {
      console.log(result);
      // 201 = success, a resource was created
      res.status(201).json({
        message: "Post created successfully",
        post: result
      });
    })
    .catch((error) => {
      console.log(error);
    });
  console.log(title, content);

};
