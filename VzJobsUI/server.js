var express = require('express');
var app = express();

app.use('/vzjobs', express.static(__dirname + 'public')); 


app.use(function (req, res, next) {
    var err = new Error('File Not Found');
    err.status = 404;
    next(err);
});
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
});

app.listen(8080);