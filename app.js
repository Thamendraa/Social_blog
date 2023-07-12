const express = require("express");
const app = express();
const port = 4003;
const uc = require("./Controller/userController");
const bc = require("./Controller/blogController");
const db = require("./Model/index");
const path = require("path");
const { storage, blogStorage, multer } = require("./Services/multerConfig");
const upload = multer({ storage: storage });
const uploadBlog = multer({ storage: blogStorage });
const isAuthenticated = require("./Milddleware/isAuthenticated");
const flash = require("connect-flash");
const dotenv = require("dotenv");
const session = require("express-session");

db.sequelize.sync({ force: false }); //datbabase link

dotenv.config();
app.use(require("cookie-parser")());

app.use(
  session({
    secret: "mySession",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "uploads/users")));
app.set("view engine", "ejs"); //gobal ejs lai call garnu ko lagi

//for users
app.get("/", uc.renderRegistration);
app.get("/login", uc.renderLogin);
app.post("/userRegistration", upload.single("image"), uc.registerUser);
app.post("/login", uc.userLogin);
app.get("/checkEmail", uc.renderEmail);
app.post("/checkEmail", uc.checkEmail);
app.post("/otpcheck", uc.otpVerify);
app.get("/logout", uc.makeLogout);

//for blog
app.get("/home", isAuthenticated.isAuthenticated, bc.renderHome);
app.use(express.static(path.join(__dirname, "uploads/blogs")));
app.get("/createBlog", isAuthenticated.isAuthenticated, bc.renderCreate);
app.post(
  "/createBlog",
  isAuthenticated.isAuthenticated,
  uploadBlog.single("image"),
  bc.createBlog
);
app.get("/myBlogs", isAuthenticated.isAuthenticated, bc.renderMyBlog);
app.get("/singlMyBlog", isAuthenticated.isAuthenticated, bc.renderSingleMyBlog);

app.get("/single/:id", bc.singleBlog);
//delete
app.get("/delete/:id", bc.delete);

//edit
app.get("/editBlog/:id", bc.renderEditBlog);

//update
app.post("/update/:id", upload.single("image"), bc.update);
app.listen(port, () => {
  console.log(" Hello, Node server started at port 4003");
});
