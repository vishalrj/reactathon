var express_graphql = require('express-graphql');
var schema = require('./schema');
var data = require('./data');

var updateCourseTopic = function ({ id, topic }) {
    data.map(course => {
        if (course.id === id) {
            course.topic = topic;
            return course;
        }
    });
    return data.filter(course => course.id === id)[0];
};

var getCourse = function (args) {
    var id = args.id;
    return data.filter(course => {
        return course.id == id;
    })[0];
};

var getCourses = function (args) {
    if (args.topic) {
        var topic = args.topic;
        return data.filter(course => course.topic === topic);
    } else {
        return data;
    }
};

var root = {
    course: getCourse,
    courses: getCourses,
    updateCourseTopic: updateCourseTopic
};

module.exports = express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
});