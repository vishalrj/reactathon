var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var serverConfig = require('./configs/server-config')

// Apps
var graphService = require('./app/graphs/index');
// var authService = require('./app/auth/index');
var authService = require('./app/auth/controller/authcontroller');
var fileHandlerService = require('./app/filehandler/index');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));

app.use('/auth', authService);
app.use('/file', fileHandlerService);
app.use('/graphql', graphService);

app.use(function(req, res, next) {  
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  });

app.listen(serverConfig.port, () => console.log('VZ JOBS SERVICE Now running on '+serverConfig.port));
