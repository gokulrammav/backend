const router = require ("express").Router();
var mysql = require("mysql");
var config = require("../config.js");
var pool = mysql.createPool(config);


router.post("/add_to_cart", async function (req, res) {
    var item = req.body.cartItem;
    var user = req.body.user;
    var uuid = req.body.uuid;
    var sqlQuery = `INSERT INTO Cart(Email, Prod_id, UUID) VALUES(?,?,?)`;
  
    pool.query(sqlQuery, [user, item, uuid], (err, result) => {
      if (result) {
      }
      if (err) {
      }
    });
  });
  
  router.post("/remove_from_cart", async function (req, res) {
    var item = req.body.cartItem;
    var user = req.body.user;
    var uuid = req.body.uuid;
  
    var sqlQuery = `DELETE FROM Cart WHERE Prod_id=? AND Email=? AND UUID=?`;
    pool.query(sqlQuery, [item, user, uuid], (err, result) => {
      if (err) {
      }
    });
  });
  
  router.post("/get_cart_products", async function (req, res) {
    var user = req.body.user;
    var sqlQuery = `select * from products inner join cart on products.prod_id=cart.prod_id where cart.email=?`;
    pool.query(sqlQuery, [user], (err, result) => {
      if (result) {
        result = JSON.stringify(result);
        result = JSON.parse(result);
        res.json(result);
      }
    });
  });
  router.post("/delete_all_cart", async function (req, res) {
    var user = req.body.user;
  
    var sqlQuery = `DELETE FROM CART WHERE email=?`;
    pool.query(sqlQuery, [user], (err, result) => {
      if (result) {
        res.send("deleted");
      }
    });
  });

  module.exports = router;