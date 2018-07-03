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

  var newUser = models.instance.User({
    name: req.body.name,
    surname: req.body.surname,
    age: req.body.age,
    email: req.body.email,
    password: hashedPassword,
    created: Date.now()
  });

  newUser.saveAsync()
    .then(function () {
      console.log('Yuppiie!');
      var token = jwt.sign({ name: newUser.name, hash: hashedPassword }, config.secret, { expiresIn: 86400 });
      return res.status(200).send({ auth: true, token: token });
    })
    .catch(function (err) {
      console.log(err);
      return res.status(401).send({ auth: false, message: 'Failed to register User.' });
    });
});

router.get('/signedIn', function (req, res) {
  var token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  jwt.verify(token, config.secret, function (err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    if (decoded) {
      models.instance.User.findOneAsync({ name: decoded.name })
        .then(function (user) {
          console.log('Found ' + user.name);
          const match = await bcrypt.compare(decoded.hash, user.password);
          if (match) { 
            return res.status(200).send({ auth: true, message: user.name + ' Authenticated.' }); 
          } else {
            return res.status(401).send({ auth: false, message: 'Failed to authenticate User.' });
          }
        })
        .catch(function (err) {
          console.log(err);
          return res.status(204).send({ auth: false, message: 'User not found. Please register to continue.' });
        });
    }
  });
});

router.get('/login', function (req, res) {
  models.instance.User.findOneAsync({ name: req.body.name })
  .then(function (user) {
    console.log('Found ' + user.name);
    await bcrypt.compare(req.body.password, user.password)
    .then((res) => { 
      return res.status(200).send({ auth: true, message: user.name + ' Authenticated.' }); 
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

module.exports = router;