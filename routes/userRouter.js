const router = require("express").Router();
 var mysql = require("mysql");
var config = require("../config.js");
var pool = mysql.createPool(config);


router.post("/user_registration", async function (req, res) {

  var name = req.body.name;
  var email = req.body.email;
  var phone = req.body.phone;
  var role = req.body.role;
  var password = req.body.password;

  var sqlQuery = `INSERT INTO users (Name,Role,Phone,Email,Password) VALUES (?,?,?,?,?)`;

  pool.query(sqlQuery, [name, role, phone, email, password], (err, result) => {
    if (err) {
      res.send("error");
    } else{
      res.send ("registered ")
    }
  });
});

router.post("/user_login", async function (req, res) {
  var email = req.body.email;
  var password = req.body.password;

  var sqlQuery = `SELECT * FROM users WHERE email=? AND password=?`;

  pool.query(sqlQuery, [email, password], (err, result) => {
    if (result.length === 1) {
      if (result[0].Email === email && result[0].Password === password) {
        res.status(200).send({
          status: true,
          data: result,
        });
      } else {
        res.status(1).send(false);
      }
    }
  });
});

module.exports = router;
