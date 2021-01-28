const router = require("express").Router();
var mysql = require("mysql");
var config = require("../config.js");
const { v4: uuidv4 } = require("uuid");
var pool = mysql.createPool(config);

router.post("/recent_address", async function (req, res) {
    var user = req.body.user;
    var sqlQuery = `SELECT * FROM address where email=? ORDER BY address_id DESC LIMIT 1`;
    pool.query(sqlQuery, [user], (err, result) => {
      if (result) {
        res.json(result);
      }
    });
  });

router.post("/place_orders", async function (req, res) {
    var user = req.body.user;
    var basket = req.body.basket;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var address = req.body.address;
    var city = req.body.city;
    var state = req.body.state;
    var pinCode = req.body.pinCode;
    var phone = req.body.phone;
    const today = new Date();
    var order_uuid = uuidv4();
    var order_total = 0;
    basket.forEach((each) => {
      order_total = order_total + each.Prod_price;
    });
  
    var addressQuery = `INSERT INTO address(Email,First_name,Last_name,address,city,state,Pincode,Phone,address_uuid) VALUES(?,?,?,?,?,?,?,?,?)`;
  
    pool.query(
      addressQuery,
      [
        user,
        firstName,
        lastName,
        address,
        city,
        state,
        pinCode,
        phone,
        order_uuid,
      ],
      (err, result) => {
        if (result) {
        }
        if (err) {
          console.log(err);
        }
      }
    );
  
    basket.forEach((each, index) => {
      var sqlQuery = `INSERT INTO orders(Order_uuid,Email,Prod_id,Order_date,Order_price) VALUES(?,?,?,?,?)`;
  
      pool.query(
        sqlQuery,
        [order_uuid, user, each.Prod_id, today, order_total],
        (err, result) => {
          if (result) {
          }
        }
      );
      if (basket.length - 1 === index) {
        var sqlQuery1 = `DELETE FROM CART WHERE email=?`;
        pool.query(sqlQuery1, [user], (err, result1) => {
          if (result1) {
            res.send("Ordered");
          }
        });
      }
    });
  });
  
  router.post("/recent_orders", async function (req, res) {
    var user = req.body.user;
  
    var sqlQuery = `select o.order_id,o.Order_uuid,o.Order_date,o.Order_price,a.*, GROUP_CONCAT(DISTINCT p.Prod_name ORDER BY o.order_date DESC) AS prod_names,GROUP_CONCAT(DISTINCT p.Prod_id ORDER BY o.order_date DESC) AS prod_ids,GROUP_CONCAT(DISTINCT p.Prod_img_url ORDER BY o.order_date DESC) AS prod_imgs,GROUP_CONCAT(DISTINCT p.Prod_price ORDER BY o.order_date DESC) AS prod_prices from address AS a, orders AS o inner join products AS p on 
    o.prod_id=p.prod_id where o.email=? and a.address_uuid=o.Order_uuid group by o.order_uuid order by o.order_date DESC`;
    pool.query(sqlQuery, [user], (err, result) => {
      result = JSON.stringify(result);
      result = JSON.parse(result);
  
      result.forEach((each, index) => {
        result[index].prod_names = each.prod_names.split(",");
        result[index].prod_ids = each.prod_ids.split(",");
        result[index].prod_imgs = each.prod_imgs.split(",");
        result[index].prod_prices = each.prod_prices.split(",");
        if (result.length - 1 === index) {
          res.json(result);
        } else {
        }
      });
    });
  });
  
  
  
  router.post("/cancelOrder", async function (req, res) {
    var user = req.body.user;
    var order_uuid = req.body.uuid;
    var sqlQuery = `DELETE FROM Orders WHERE email=? and Order_uuid=?`;
    pool.query(sqlQuery, [user, order_uuid], (err, result) => {
      if (result) {
        res.send("Order Canclled");
      }
    });
  });

 
  

  module.exports = router;
  