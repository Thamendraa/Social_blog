const express = require("express");
const app = express();
const port = 4003;
const uc = require("./Controller/userController");
const db = require("./Model/index");
const path = require("path");

db.sequelize.sync({ force: false }); //datbabase link
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs"); //gobal ejs lai call garnu ko lagi

app.get("/", uc.renderRegistration);
app.get("/login", uc.renderLogin);

app.listen(port, () => {
  console.log(" Hello, Node server started at port 4002");
});
