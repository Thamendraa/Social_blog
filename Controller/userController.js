const { name } = require("ejs");
const DB = require("../Config/dbConfig");
const db = require("../Model/index");
const USER = db.user;
const path = require("path");
const bcrypt = require("bcryptjs");
const { text } = require("express");
const sendEmail = require("../Services/sendEmail");

exports.renderRegistration = async (req, res) => {
  res.render("userRegistration");
};

exports.renderLogin = async (req, res) => {
  res.render("login");
};

exports.renderEmail = async (req, res) => {
  res.render("checkEmail");
};
exports.registerUser = async (req, res) => {
  console.log(req.file);
  const { userName, email, userAddress, password, image } = req.body;

  //create user
  const created = await USER.create({
    name: userName,
    email,
    address: userAddress,
    password: bcrypt.hashSync(password, 12),
    image: "https://localost:4003/" + req.file.filename,
  });
  //email
  const message = userName + " Wellcome to the the Socail zone";
  const subject = "Sucessfull";
  await sendEmail({
    to: email,
    text: message,
    subject: subject,
  });
  res.redirect("home");
};

//for login
exports.userLogin = async (req, res) => {
  const { userName, email, password } = req.body;

  const userSearch = await USER.findAll({
    where: {
      email: email,
    },
  });
  console.log(email);

  if (userSearch.length == 0) {
    console.log("wrong email");
    res.redirect("userRegistration");
  }
  if (bcrypt.compareSync(password, userSearch[0].password)) {
    res.redirect("home");
  } else {
    res.redirect("login");
    console.log("wrong password");
  }
};

//for logout
exports.checkEmail = async (req, res) => {
  const { email } = req.body;
  const check = await USER.findOne({
    where: {
      email: email,
    },
  });
  if (check.length != 0) {
    try {
      const randomOTP = Math.floor(100000 + Math.random() * 900000);
      const message = "Your OTP is" + randomOTP;
      await sendEmail({
        to: email,
        text: message,
        subject: "For reset password",
      });
      check.otp = randomOTP;
      await check.save();
    } catch (e) {
      console.log("error");
      res.render("error");
    }
    return res.render("otpCheck");
  }
};

//confroming OTP
exports.otpVerify = async (req, res) => {
  const { otp, newPassword } = req.body;
  const encPassword = bcrypt.hashSync(newPassword, 12);
  console.log(newPassword);
  const foundOtp = await USER.findOne({
    where: {
      otp: otp,
    },
  });
  console.log(otp);
  if (foundOtp) {
    foundOtp.password = encPassword;
    foundOtp.otp = null;
    await foundOtp.save();
  } else {
    console.log("OTP no match");
    return res.render("otpCheck");
  }
  return res.redirect("/login");
};

//resetPassword
// exports.resetPwd = async (req, res) => {
//   const { newPassword, confirmPassword } = rq.body;
//   if (newPassword.length == confirmPassword.length) {
//     return (finalPassword = confirmPassword);
//   } else {
//     console.log("flas msg pwd not match");
//   }
//   console.log(finalPassword);
// };
