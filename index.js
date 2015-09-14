/*node_xj = require("xls-to-json");
  node_xj({
    input: "excel/sample.xls",  // input xls 
    output: null // output json 
  }, function(err, result) {
    if(err) {
      console.error(err);
    } else {
      console.log(result);
    }
  });*/
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var compression = require('compression');
var express = require('express');
var app = express();
app.use(compression({filter:shouldCompress})); // 启用gzip压缩

function shouldCompress(req, res){
  if(res.get('Content-Type') == 'text/html') return false;
  return compression.filter(req, res);
}

// 获取指定文件
app.get('/files/:id', function (req, res) {
  var options = {
    root: __dirname + '/resources/',
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
  };
  res.sendFile(req.params.id, options, function(err){
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
    else {
      console.log('Sent:', fileName);
    }
  })
});

// 上传文件
var multiparty = require('multiparty');
app.post('/files', function(req, res){
  var options = {
    autoFiles:true,
    uploadDir:'./resources/'
  }
  var form = new multiparty.Form(options);
  form.parse(req, function(err, fields, files){
    if(err){
      console.log(err);
      res.json({status:"failed",mesg:err.toString()});
    }else{
      var resJson = [];
      _.flatten(_.values(files)).forEach(function(file){
        var newName = Date.now() + path.extname(file.originalFilename);
        try{
          fs.renameSync(file.path, './resources/'+newName);
          resJson.push({status:"succ",mesg:newName});
        }catch(err){
          resJson.push({status:"failed",mesg:err.toString()});
        }
      })
      res.json(resJson);
    }
  })
})

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('app listening at http://%s:%s', host, port);
});