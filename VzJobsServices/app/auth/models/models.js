var dbConfig = require('../config/dbconfig');
var models = require('express-cassandra');

models.setDirectory( __dirname + '/models').bind(
    {
        clientOptions: dbConfig.clientOptions,
        ormOptions: dbConfig.ormOptions
    },
    function(err) {
        if(err) throw err;
    }
);

module.exports = models;