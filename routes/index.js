const express = require("express");
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const jwtKey = require('../config/keys.js').jwtKey;

router.get("/", (req, res) => {
  res.json({
    message: 'Welcome to the api.'
  });
});

router.post('/api/register', (req, res) => {
  User.find({username: req.body.username}, (err, user) => {
    if (user.length > 0) {
      res.json({message: 'Username already exists!'});
    } else {
      User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
        if (err) {
          res.sendStatus(500);
        } else {
          res.json({message: `User ${user.username} registered!`});
        }
      });
    }
  });
});

router.post('/api/login',passport.authenticate('local'), (req, res) => {
  jwt.sign({ user: req.user.username, id: req.user._id }, jwtKey, { expiresIn: '1h' }, function(err, token) {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        token: token
      });
    }
  });
  req.logout();
});

module.exports = router;