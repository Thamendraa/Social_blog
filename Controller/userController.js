const { name } = require("ejs");
const DB = require("../Config/dbConfig");
const db = require("../Model/index");
const USER = db.user;
const path = require("path");
const bcrypt = require("bcryptjs");
const { text } = require("express");

exports.renderRegistration = async (req, res) => {
  res.render("userRegistration");
};

exports.renderLogin = async (req, res) => {
  res.render("login");
};

exports.registerUser = async (req, res) => {
  console.log(req.file);
  const { userName, email, userAddress, image } = req.body;

  const created = await USER.create({
    name: userName,
    email,
    address: userAddress,
    image: "https://localost:4003/" + req.file.filename,
  });
};
