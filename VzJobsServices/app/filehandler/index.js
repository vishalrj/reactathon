var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var multer = require('multer');
var upload = multer({ dest: './uploads/'});

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));

app.post('/files',upload.single('test'), function(req, res, next){
    console.log(req.body) // form fields
    console.log(req.files) // form files
    res.status(204).end()
});


module.exports = app;