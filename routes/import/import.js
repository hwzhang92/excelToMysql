var node_xj = require("xls-to-json");
var mysql = require('mysql');
var EventProxy = require('eventproxy');
var express = require('express');
var router = express.Router();
var config = require('./config');
var filesRootPath = process.cwd() + config.root;

var sql = "INSERT INTO ?? SET ?";

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
      // 载入预处理器
      var preProcessors = require("./preProcessor.js");
      // 连接数据库
      var connection = mysql.createConnection(import_conf.connection);
      connection.connect();
      connection.query("set autocommit=1"); // 设置自动提交事务
      // 处理数据
      var ep = new EventProxy();
      ep.after('insert',result.length,function(list){
        // 返回结果
        res.json(list);
      })
      result.forEach(function(item,index){
         // 预处理原始数据
        import_conf.preProcessors.forEach(function(fun){
          item = preProcessors[fun](item);
        })
        var ids = {}; // 保存每次插入成功之后记录的id，以表名称为key
        (function(i,colModels){
          var fn = arguments.callee;
          if(i>=colModels.length){
            ep.emit('insert',{"index":index,"status":"succ"});
          }else{
            connection.query(sqlHandle(colModels[i],ids,item),function(err,result){
              if(err) {
                ep.emit('insert',{"index":index,"status":"failed",mesg:err});
              }
              ids[colModels[i].tableName] = result.insertId;
              fn(i+1,colModels);
            })
          }
        })(0,import_conf.colModels);
      })

      // 关闭数据连接
      connection.end();
    }
  });
})

function sqlHandle(model,ids,item){
  var insertValues = {};
  model.columnMapping.forEach(function(mapping){
    switch(mapping.valueGenerator){
      case "fileColumn":
        insertValues[mapping.name] = item[mapping[mapping.valueGenerator]];
        break;
      case "relateId":
        insertValues[mapping.name] = ids[relateId];
        break;
      case "constant":
        insertValues[mapping.name] = mapping[mapping.valueGenerator];
        break;
    }
  })
  return mysql.format(sql,[model.tableName,insertValues]);
}

module.exports = router;