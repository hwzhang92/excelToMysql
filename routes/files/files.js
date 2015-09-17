var config = require('./config');
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

// http 405
router.all('*',function(req,res,next){
  if(config.allow.indexOf(req.method)===-1){
    res.status(405).end();
  }else{
    next();
  }
})

// options
router.options('/',function(req,res){
  res.set('Allow',config.allow.join(',')).status(200).end();
})

// 获取文件列表
router.get('/',function(req, res){
  var files = fs.readdirSync(filesRootPath);
  var fileList = files.filter(function(item){
    return item[0]!=='.' && fs.statSync(filesRootPath+'/'+item).isFile();
  });
  res.json(fileList);
})

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
      res.json({status:"failed",mesg:err.message});
    }else{
      var resJson = [];
      _.flatten(_.values(files)).forEach(function(file){
        var newName = Date.now() + path.extname(file.originalFilename);
        try{
          fs.renameSync(file.path, filesRootPath+newName);
          resJson.push({status:"succ",mesg:newName});
        }catch(err){
          resJson.push({status:"failed",mesg:err.message});
        }
      })
      res.json(resJson);
    }
  })
})

// 上传文件，指定文件名，若存在则不创建
router.post('/:id',function(req, res){
  var options = {
    autoFiles:true,
    uploadDir:filesRootPath
  }
  var form = new multiparty.Form(options);
  form.parse(req, function(err, fields, files){
    if(err){
      console.log(err);
      res.json({status:"failed",mesg:err.message});
    }else{
      var fileList = _.flatten(_.values(files));
      if(fileList.length === 0){
        res.json({status:"failed",mesg:"there is no file in http body!"});
      }else{
        var filename = req.params.id;
        try{
          fs.accessSync(filesRootPath+filename, fs.F_OK);
        }catch(err){
          var file = fileList[0];
          try{
            fs.renameSync(file.path, filesRootPath+filename);
            res.json({status:"succ",mesg:filename});
          }catch(err){
            res.json({status:"failed",mesg:err.message});
          }
          return;
        }
        res.json({status:"succ",mesg:filename});
      }
    }
  })
})

// 上传文件，指定文件名，若存在则更新，不存在则新建
router.put('/:id',function(req,res){
  var options = {
    autoFiles:true,
    uploadDir:filesRootPath
  }
  var form = new multiparty.Form(options);
  form.parse(req, function(err, fields, files){
    if(err){
      console.log(err);
      res.json({status:"failed",mesg:err.message});
    }else{
      var fileList = _.flatten(_.values(files));
      if(fileList.length === 0){
        res.json({status:"failed",mesg:"there is no file in http body!"});
      }else{
        var file = fileList[0];
        var filename = req.params.id;
        try{
          fs.renameSync(file.path, filesRootPath+filename);
          res.json({status:"succ",mesg:filename});
        }catch(err){
          res.json({status:"failed",mesg:err.message});
        }
      }
    }
  })
})

// 删除指定文件
router.delete('/:id',function(req,res){
  fs.unlink(filesRootPath+req.params.id,function(err){
    if(err){
      console.log(err);
      res.json({status:"failed"});
    }else{
      res.json({status:"succ"})
    }
  })
})

// 判断文件是否存在
router.head('/:id',function(req,res){
  try{
    fs.accessSync(filesRootPath+filename, fs.F_OK);
    res.status(200).end();
  }catch(err){
    res.status(404).end();
  }
})

module.exports = router;