const router = require("express").Router();
var mysql = require("mysql");
var config = require("../config.js");
var pool = mysql.createPool(config);

router.post("/get_products", async function (req, res) {
    var page = req.body.page;
  
    if (page === undefined) {
      items = 0;
    } else if (page == 1) {
      items = 0;
    } else {
      var items = page * 10 - 10;
    }
  
    var sqlQuery = `SELECT * FROM products ORDER BY Prod_name ASC LIMIT ?,10`;
    pool.query(sqlQuery, [items], (err, result) => {
      if (result) {
        console.log(result);
        res.json(result);
      }
    });
  });
  
  router.get("/total_products", async function (req, res) {
    var sqlQuery = `SELECT COUNT(prod_id) FROM products`;
    pool.query(sqlQuery, (err, result) => {
      if (result) {
        result = JSON.stringify(result);
        result = JSON.parse(result);
        res.json(result[0]["COUNT(prod_id)"]);
      }
    });
  });
  
  function arrayUnique(array) {
    var a = array.concat();
    for (var i = 0; i < a.length; ++i) {
      for (var j = i + 1; j < a.length; ++j) {
        if (a[i].Prod_id === a[j].Prod_id) {
          a.splice(j--, 1);
        }
      }
    }
  
    return a;
  }
  
  router.post("/search_products", async function (req, res) {
    var prodName = req.body.prodname;
    var sqlQuery = `SELECT * FROM products WHERE Prod_name LIKE '${prodName}%' ORDER BY Prod_name ASC; SELECT * FROM products WHERE Prod_name LIKE '%${prodName}%' ORDER BY Prod_name ASC;`;
    pool.query(sqlQuery, (err, result, fields) => {
      if (result) {
        var array1 = JSON.stringify(result[0]);
        var resarray1 = JSON.parse(array1);
        var array2 = JSON.stringify(result[1]);
        var resarray2 = JSON.parse(array2);
        var total_res = arrayUnique(resarray1.concat(resarray2));
        res.json(total_res);
      }
    });
  });
  
  
  router.get("/get_categories", async function (req, res) {
    var sqlQuery = `SELECT * FROM categories`;
  
    pool.query(sqlQuery, (err, result) => {
      if (result) {
        res.json(result);
      }
    });
  });
  
  router.get("/get_latest", async function (req, res) {
    var sqlQuery = `SELECT * FROM products ORDER BY Prod_name ASC LIMIT 4`;
    pool.query(sqlQuery, (err, result) => {
      if (result) {
        res.json(result);
      }
    });
  });

  router.post("/get_products_by_category", async function (req, res) {
    var cat_name = req.body.cat_name;
    var sqlQuery = `SELECT * FROM products where Categories_name=?`;
    pool.query(sqlQuery, [cat_name], (err, result) => {
      if (result) {
        res.json(result);
      }
    });
  });
  


  module.exports = router;