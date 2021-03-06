var dbConfig = require('../../../configs/dbconfig');
var models = require('express-cassandra');

models.setDirectory( __dirname).bind(
    {
        clientOptions: dbConfig.clientOptions,
        ormOptions: dbConfig.ormOptions
    },
    function(err) {
        if(err) throw err;
    }
);

module.exports = models;