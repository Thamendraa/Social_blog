const { name } = require("ejs");
const DB = require("../Config/dbConfig");
const db = require("../Model/index");
const USER = db.user;
const path = require("path");
const { text } = require("express");

exports.renderHome = async (req, res) => {
  res.render("home");
};
exports.renderCreate = async (req, res) => {
  res.render("createBlog");
};
