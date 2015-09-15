var node_xj = require("xls-to-json");
var mysql = require('mysql');
var express = require('express');
var router = express.Router();
var config = require('../configs/import');
var filesRootPath = process.cwd() + config.root;

router.post('/',function(req,res){
  node_xj({
    input: filesRootPath+req.query.file,  // input xls 
    output: null // output json 
  }, function(err, result) {
    if(err) {
      console.error(err);
    } else {
      var connection = mysql.createConnection(req.query.db);
      connection.connect();
      connection.end();
    }
  });
})

module.exports = router;