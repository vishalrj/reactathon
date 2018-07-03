var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config/appconfig');
var models = require('../models/models');

router.use(bodyParser.json());

router.post('/register', function (req, res) {

  var hashedPassword = bcrypt.hashSync(req.body.password, 8);

  var newUser = new models.instance.User({
    name: req.body.name,
    surname: req.body.surname,
    age: req.body.age,
    email: req.body.email,
    password: hashedPassword
  });

  newUser.saveAsync()
    .then(function () {
      console.log('Yuppiie!');
      var token = jwt.sign({ name: newUser.name, hash: hashedPassword }, config.secret, { expiresIn: config.exptime });
      models.instance.User.findOneAsync({ name: newUser.name })
        .then(function (user) {
          console.log('Found ' + user.name);
          var session = new models.instance.Session({
            userId  : user.id,
            name    : user.name,
            exp     : config.exptime,
            token   : token,
          });
          session.saveAsync()
              .then(()=>{return res.status(200).send({ auth: true, token: token });})
              .catch((err)=>{console.log(err);return res.status(500).send({ auth: false, message: 'Unable to save Session.' });});
        })
        .catch(function (err) {
          console.log(err);
          return res.status(404).send({ auth: false, message: 'Unable to find the user in table.' });
        });
    })
    .catch(function (err) {
      console.log(err);
      return res.status(401).send({ auth: false, message: 'Failed to register User.' });
    });
});

router.get('/authenticate', function (req, res) {
  var token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  models.instance.Session.findOne({ name: req.body.name }, (err, session)=>{
    if(err) throw err;
    if(session.token === token){
      jwt.verify(token, config.secret, function (err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        if (decoded) {
          if(decoded.exp < new Date().getTime()){
            return res.status(200).send({ auth: true, message: user.name + ' Authenticated.' }); 
          } else {
            return res.status(401).send({ auth: false, message: 'Failed to authenticate User.' });
          }
        }
      });
    } else {
      return res.status(401).send({ auth: false, message: 'Failed to authenticate User.' });
    }
  });
});

router.get('/login', function (req, res) {
  models.instance.User.findOneAsync({ name: req.body.name })
  .then(function (user) {
    console.log('Found ' + user.name);
    bcrypt.compare(req.body.password, user.password)
    .then((res) => { 
      var token = jwt.sign({ name: user.name, hash: user.password }, config.secret, { expiresIn: config.exptime });
      models.instance.Session.findOne({ name: req.body.name }, (err, session)=>{
        if(err) throw err;
        session.delete((err)=>{console.log(err);});
      });
      var session = new models.instance.Session({
        userId  : user.id,
        name    : user.name,
        exp     : config.exptime,
        token   : token,
      });
      session.saveAsync()
          .then(()=>{return res.status(200).send({ auth: true, token: token, message: user.name + ' Authenticated.' });})
          .catch((err)=>{console.log(err);return res.status(500).send({ auth: false, message: 'Unable to save Session.' });});
      // res.status(200).send({ auth: true, message: user.name + ' Authenticated.' });
      // next(user);
    })
    .catch(function (err) {
      console.log(err);
      return res.status(401).send({ auth: false, message: 'Incorrect Username/Password.' });
    });
  })
  .catch(function (err) {
    console.log(err);
    return res.status(204).send({ auth: false, message: 'User not found. Please register to continue.' });
  });
});

router.get('/logout', function(req, res) {
  models.instance.Session.findOne({ name: req.body.name }, (err, session)=>{
    if(err) throw err;
    session.delete((err)=>{console.log(err);});
  });
  res.status(200).send({ auth: false, token: null });
});

module.exports = router;