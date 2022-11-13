const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;
  Post.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Post.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((posts) => {
      res
        .status(200)
        .json({ message: 'Posts fetched', posts: posts, totalItems: totalItems }); // 200 = success
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error('Could not find post');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: 'Post fetched', post: post });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect');
    error.statusCode = 422;
    throw error;
  }
  if (!req.file) {
    const error = new Error('No image provided');
    error.statusCode = 422;
    throw error;
  }
  //const imageUrl = req.file.path; //doesn't work in windows
  const imageUrl = req.file.path.replace('\\', '/');
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: { name: 'patiq' },
  });
  post
    .save()
    .then((result) => {
      console.log(result);
      // 201 = success, a resource was created
      res.status(201).json({
        message: 'Post created successfully',
        post: result,
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
  console.log(title, content);
};

exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect');
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image; // no new image was picked
  if (req.file) {
    // user picked a new image
    imageUrl = req.file.path.replace('\\', '/');
  }
  if (!imageUrl) {
    const error = new Error('No image provided');
    error.statusCode = 422;
    throw error;
  }
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error('Could not find post');
        error.statusCode = 404;
        throw error;
      }
      if (imageUrl !== post.imageUrl) {
        // new image was uploaded
        deleteImage(post.imageUrl);
      }
      post.title = title;
      post.imageUrl = imageUrl;
      post.content = content;
      return post.save();
    })
    .then((result) => {
      res.status(200).json({ message: 'Post updated', post: result });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error('Could not find post');
        error.statusCode = 404;
        throw error;
      }
      // check logged in user
      deleteImage(post.imageUrl);
      return Post.findByIdAndRemove(postId);
    })
    .then((result) => {
      console.log(result);
      res.status(200).json({ message: 'Post deleted' });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

const deleteImage = (filePath) => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
