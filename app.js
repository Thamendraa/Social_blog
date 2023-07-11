const express = require("express");
const app = express();
const port = 4003;
const uc = require("./Controller/userController");
const bc = require("./Controller/blogController");
const db = require("./Model/index");
const path = require("path");
const { stroge, multer } = require("./Services/multerConfig");
const upload = multer({ storage: stroge });
db.sequelize.sync({ force: false }); //datbabase link
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs"); //gobal ejs lai call garnu ko lagi

//for users
app.get("/", uc.renderRegistration);
app.get("/login", uc.renderLogin);
app.post("/userRegistration", upload.single("image"), uc.registerUser);
app.post("/login", uc.userLogin);
app.get("/checkEmail", uc.renderEmail);
app.post("/checkEmail", uc.checkEmail);
app.post("/otpcheck", uc.otpVerify);

//for blog
app.get("/home", bc.renderHome);
app.get("/createBlog", bc.renderCreate);
app.listen(port, () => {
  console.log(" Hello, Node server started at port 4002");
});
