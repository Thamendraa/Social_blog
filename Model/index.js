const dbConfig = require("../Config/dbConfig");
const { Sequelize, DataTypes, hasMany } = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("CONNECTED!!");
  })
  .catch((err) => {
    console.log("Error" + err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./userModel.js")(sequelize, DataTypes);
db.blog = require("./blogModel.js")(sequelize, DataTypes);
db.comment = require("./commentModel")(sequelize, DataTypes);
//to show the created by (relation between user and blogs)
db.user.hasMany(db.blog);
db.blog.belongsTo(db.user);

//for comment (relation between blog and comments)
db.blog.hasMany(db.comment);
db.comment.belongsTo(db.blog);

//for comment (realation beween user and comment)
db.user.hasMany(db.comment);
db.comment.belongsTo(db.user);

module.exports = db;
