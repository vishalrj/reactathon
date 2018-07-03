var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  });
var upload = multer({ storage: storage });

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));

app.post('/upload',upload.single('file'), async function(req, res, next){
    // try{
    // } catch(err){
    //     res.sendStatus(400);
    // }
    res.status(201).end();
    // res.send({ id: data.$loki, fileName: data.filename, originalName: data.originalname })
});


module.exports = app;