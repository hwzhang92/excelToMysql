var config = require('../configs/files');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var compression = require('compression');
var multiparty = require('multiparty');
var express = require('express');
var router = express.Router();
router.use(compression({filter:shouldCompress})); // 启用gzip压缩

function shouldCompress(req, res){
  var contentType = res.get('Content-Type');
  if(_.isEmpty(contentType)) return false;
  if(config.gzip.indexOf(contentType.split(';')[0]) === -1 ) return false;
  return true;
}

var filesRootPath = process.cwd() + config.root;

// 获取指定文件
router.get('/:id', function (req, res) {
  var options = {
    root: filesRootPath,
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
  })
});

// 上传文件
router.post('/', function(req, res){
  var options = {
    autoFiles:true,
    uploadDir:filesRootPath
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
          fs.renameSync(file.path, filesRootPath+newName);
          resJson.push({status:"succ",mesg:newName});
        }catch(err){
          resJson.push({status:"failed",mesg:err.toString()});
        }
      })
      res.json(resJson);
    }
  })
})

module.exports = router;