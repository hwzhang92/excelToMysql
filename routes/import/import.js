var _ = require('lodash');
var node_xj = require("xls-to-json");
var mysql = require('mysql');
var EventProxy = require('eventproxy');
var express = require('express');
var router = express.Router();
var config = require('./config');
var filesRootPath = process.cwd() + config.root;

var sql = "INSERT INTO ?? SET ?";

router.post('/',function(req,res){
  // 读取excel文件
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
      // 跟请求参数合并
      import_conf = _.defaultsDeep(req.body,import_conf);
      // 载入预处理器
      var preProcessors = require("./preProcessor.js");
      // 连接数据库
      var connection = mysql.createConnection(import_conf.connection);
      connection.connect();
      connection.query("set autocommit=1"); // 设置自动提交事务
      // 定义所有插入操作完成后触发的事件，返回处理结果
      var ep = new EventProxy();
      ep.after('insert',result.length,function(list){
        // 返回结果
        list = list.filter(function(n){return n!=null}); // 去掉null元素
        if(!res.headersSent) res.json(list);
      })
      // 处理数据
      result.forEach(function(item,index){
        // 预处理原始数据
        import_conf.preProcessors.forEach(function(fun){
          item = preProcessors[fun](item);
        })
        //插入数据，根据配置一行数据可能要插入到多张表
        var ids = {}; // 保存每次插入成功之后记录的id，以表名称为key
        (function(i,colModels){
          var fn = arguments.callee;
          if(i>=colModels.length){
            ep.emit('insert');
          }else{
            var insertSql = sqlHandle(colModels[i],ids,item);
            connection.query(insertSql,function(err,result){
              if(err) {
                ep.emit('insert',{"index":index,"mesg":err});
                return;
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
        insertValues[mapping.name] = ids[mapping[mapping.valueGenerator]];
        break;
      case "constant":
        insertValues[mapping.name] = mapping[mapping.valueGenerator];
        break;
    }
  })
  return mysql.format(sql,[model.tableName,insertValues]);
}

module.exports = router;