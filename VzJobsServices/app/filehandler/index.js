var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/tmp/my-uploads')
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

app.post('/files',upload.single('test'), async function(req, res, next){
    console.log(req.body) // form fields
    console.log(req.files) // form files
    try{

    } catch(err){
        res.sendStatus(400);
    }
    res.status(201)
    // res.send({ id: data.$loki, fileName: data.filename, originalName: data.originalname })
});


module.exports = app;