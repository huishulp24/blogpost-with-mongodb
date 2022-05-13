require("dotenv").config();
const express = require("express");
const app = new express();
const path = require("path");
const ejs = require("ejs");
app.set("view engine", "ejs");
const cors = require("cors");
const BlogPost = require("./models/BlogPost");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// mongoose.connect('mongodb://localhost/my_database_1', {useNewUrlParser: true});

app.use(cors());
mongoose.connect(
process.env.DATABASE_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("connected to DB")
);
app.use(express.static("public"));
app.listen(3030, () => {
  console.log("App listening on port 3030");
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/create", (req, res) => {
  res.render("create");
});
app.get("/index", (req, res) => {
  res.render("index");
});
app.get("/about", (req, res) => {
  res.render("about");
});
app.get("/post", (req, res) => {
  res.render("post");
});
app.get("/contact", (req, res) => {
  res.render("contact");
});

// get all posts
app.get("/allposts", function (req, res, next) {
  BlogPost.find((err, docs) => {
    if (!err) {
      res.render("allposts", {
        data: docs,
      });
    } else {
      console.log("Failed to retrieve the blog Lists: " + err);
    }
  });
});

// redirect to edit page
app.get("/edit/(:id)", async (req, res) => {
  BlogPost.findOne({ _id: req.params.id }).exec(function (err, docs) {
    if (!err) {
      res.render("edit", { data: docs });
    } else {
      console.log("Error:", err);
    }
  });
});

// update post
app.post("/update/(:id)", function (req, res) {
  BlogPost.findByIdAndUpdate(
    req.params.id,
    {
      $set: { title: req.body.title, body: req.body.body },
    },
    { new: true },
    function (err, docs) {
      if (err) {
        console.log(err);
        res.render("edit", { data: req.body });
      }
      res.redirect("/allposts");
    }
  );
});
//   delete post

app.get("/delete/(:id)", function (req, res, next) {
  BlogPost.findByIdAndRemove(req.params.id, (err, doc) => {
    if (!err) {
      res.redirect("/allposts");
      console.log("post successfully removed");
    } else {
      console.log("Failed to Delete user Details: " + err);
    }
  });
});

// create a new post
app.post("/posts", (req, res) => {
  // model creates a new doc with browser data
  const blog = new BlogPost({
    title: req.body.title,
    body: req.body.body,
  });
  blog.save(blog, function (err, docs) {
    if (err) {
      console.log(err);
      res.render("create", { data: req.body });
    }
    res.redirect("/allposts");
  }
  );
  });
