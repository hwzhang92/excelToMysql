var express = require('express');
var app = express();

var files = require('./routes/files');
var _import = require('./routes/import.js');

app.use('/files',files);
app.use('/import',_import);

module.exports = app;