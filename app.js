var logger = require('morgan');
var express = require('express');
var app = express();

var files = require('./routes/files/files');
var _import = require('./routes/import/import');

app.use(logger('dev'));

app.use('/files',files);
app.use('/import',_import);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    console.log(err);
    res.status(err.status || 500).end();
    console.log("yes");
});

module.exports = app;