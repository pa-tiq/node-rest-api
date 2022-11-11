const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoConnect = require("./util/database");

const feedRoutes = require("./routes/feed_router");
const app = express();

app.use(bodyParser.json()); // parse incoming JSON data

app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  //middleware to solve CORS error
  res.setHeader("Access-Control-Allow-Origin", "*"); //allow origins to access my data
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  ); //allow origins to use my HTTP methods
  res.setHeader("Access-Control-Allow-Headers", "Content-type, Authorization"); //allow origins to use certain headers
  next(); //the request can now continue
});

app.use("/feed", feedRoutes); // GET /feed/

app.use((error, req, res, next) => {
  // executed whenever an error is thrown with throw() or forwarded with next()
  console.log(error);
  const status = error.statusCode || 500; // if error.statusCode is undefined, then status = 500
  const message = error.message;
  res.status(status).json({ message: message });
});

mongoConnect((client) => {
  app.listen(8080);
});
