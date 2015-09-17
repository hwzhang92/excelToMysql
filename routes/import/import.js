var node_xj = require("xls-to-json");
var mysql = require('mysql');
var express = require('express');
var router = express.Router();
var config = require('./config');
var filesRootPath = process.cwd() + config.root;

router.post('/',function(req,res){
  node_xj({
    input: filesRootPath+req.query.file,  // input xls 
    output: null // output json 
  }, function(err, result) {
    if(err) {
      console.error(err);
      res.status(err.status).end();
    } else {
      // 获取导入配置
      var import_conf = require("./import.json"); 
      // 预处理配置
      
      // 预处理文件数据(excel)
      
      // 连接数据库
      // 根据配置和文件数据导入
      // 关闭配置
      // 返回结果

      /*var connection = mysql.createConnection(req.query.db);
      connection.connect();
      connection.end();*/
    }
  });
})

module.exports = router;