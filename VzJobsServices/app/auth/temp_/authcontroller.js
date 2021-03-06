var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('./config');

router.use(bodyParser.json());

router.post('/register', function(req, res) {
  console.log(req.body.password);
  var hashedPassword = bcrypt.hashSync(req.body.password, 2);
  console.log(hashedPassword);

  var token = jwt.sign({ id: req.body.name }, config.secret, {
    expiresIn: 86400 // expires in 24 hours
  });
  res.status(200).send({ auth: true, token: token });

  // User.create({
  //   name : req.body.name,
  //   email : req.body.email,
  //   password : hashedPassword
  // },
  // function (err, user) {
  //   if (err) return res.status(500).send("There was a problem registering the user.")
  //   // create a token
  //   var token = jwt.sign({ id: user._id }, config.secret, {
  //     expiresIn: 86400 // expires in 24 hours
  //   });
  //   res.status(200).send({ auth: true, token: token });
  // }); 
});

router.get('/login', function(req, res) {
  var token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    res.status(200).send(decoded);
  });
});

module.exports = router;