const { name } = require("ejs");
const db = require("../Model/index");
const { QueryTypes } = require("sequelize");
const Blogs = db.blog;

exports.renderHome = async (req, res) => {
  const blogs = await db.sequelize.query(
    "SELECT blogs.*, users.name AS authorName FROM blogs JOIN users ON blogs.userId = users.id",
    {
      type: QueryTypes.SELECT,
    }
  );
  console.log(blogs);
  const message = req.flash();
  res.render("home", { msg: message, blogs });
};
exports.renderCreate = async (req, res) => {
  res.render("createBlog");
};

//create blog
exports.createBlog = async (req, res) => {
  const { title, description, image } = req.body;

  const create = await Blogs.create({
    title: title,
    description: description,
    image: "http://localhost:4003/" + req.file.filename,
    userId: req.user.id,
  });
  res.redirect("home");
};

// display single blog
exports.singleBlog = async (req, res) => {
  const id = req.params.id;
  const blog = await Blogs.findAll({
    where: {
      id: id,
    },
  });
  res.render("singleBlog", { blog: blog[0] });
};

//edit blog
exports.renderEditBlog = async (req, res) => {
  const blogData = await Blogs.findOne({
    where: {
      id: req.params.id,
    },
  });
  res.render("editBlog", { blog: blogData });
};
//update after edit
exports.update = async (req, res) => {
  const updatedData = {
    title: req.body.title,
    description: req.body.description,
  };
  if (req.file) {
    updatedData.image = "http://localhost:4003/" + req.file.filename;
  }

  const updateBlog = await Blogs.update(updatedData, {
    where: {
      id: req.params.id,
    },
  });
  res.redirect("/home");
};

//delete
exports.delete = async (req, res) => {
  console.log(req.params.id);
  const blog = await db.blog.destroy({
    where: {
      id: req.params.id,
    },
  });
  res.redirect("/home");
};
//myblogs
exports.renderMyBlog = async (req, res) => {
  console.log(req.user);
  const myBlog = await db.blog.findAll({
    where: {
      userId: req.user.id,
    },
  });
  res.render("myBlogs", { myBlogs: myBlog });
};

//view-my single blog
exports.renderSingleMyBlog = async (req, res) => {
  const myBlog = await Blog.findOne({
    where: {
      id: req.params.id,
    },
  });
  res.render("singleMyBlog", { activePage: "myBlogs", myBlog: myBlog });
};
