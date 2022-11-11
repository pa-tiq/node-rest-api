exports.getPosts = (req, res, next) => {
  // 200 = success
  res.status(200).json({
    posts: [{ title: "oieeeee", content: "diaaaaaaaaaaaaaaaaaaaaaaaaaaa" }],
  });
};

exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  console.log(title,content);
  // 201 = success, a resource was created
  res.status(201).json({
    message: 'Post created successfully',
    post: {id: new Date().toISOString(), title: title, content:content }
  });
}