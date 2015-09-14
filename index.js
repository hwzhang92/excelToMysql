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
var compression = require('compression');
var express = require('express');
var app = express();
app.use(compression({filter:shouldCompress}));

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
app.post('/files', function(req, res){
  res.send('files created!');
})

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('app listening at http://%s:%s', host, port);
});