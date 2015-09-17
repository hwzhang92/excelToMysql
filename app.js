var logger = require('morgan');
var express = require('express');
var app = express();
var domain = require('domain');

var files = require('./routes/files/files');
var _import = require('./routes/import/import');

app.use(function (req, res, next) {
    var reqDomain = domain.create();
    reqDomain.on('error', function (err) { // 下面抛出的异常在这里被捕获
    		console.log(err);
        res.status(err.status || 500).end(); // 成功给用户返回了 500
    });
    reqDomain.run(next);
});
app.use(logger('dev'));
app.use(function(req, res, next){
	res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	next();
})

app.use('/files',files);
app.use('/import',_import);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

module.exports = app;