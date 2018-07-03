var expressCassandra = require('express-cassandra');

var clientOptions = {
    contactPoints: ['127.0.0.1'],
    protocolOptions: { port: 9042 },
    keyspace: 'mykeyspace',
    queryOptions: {consistency: expressCassandra.consistencies.one},
    authProvider: new models.driver.auth.PlainTextAuthProvider('my_user', 'my_password')
};

var dbOrmOptions = {
    defaultReplicationStrategy : {
        class: 'SimpleStrategy',
        replication_factor: 1
    },
    migration: 'safe'
};

var cassandraConfig = {
    clientOptions: clientOptions,
    ormOptions: dbOrmOptions
};

module.exports = cassandraConfig;