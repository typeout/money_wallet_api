const express = require('express');
const router = express.Router();
const User = require('../models/user');
const middleware = require('../middleware/middleware');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const jwtKey = require('../config/keys.js').jwtKey;

//login route
router.post('/api/user', passport.authenticate('local'), (req, res) => {
  //const id = req.user._id;
  User.findOne({_id: req.user._id}, (err, foundUser) => {
    if (err) {
      res.sendStatus(500);
    } else {
      if (!foundUser.is_active) {
        res.sendStatus(403);
      } else {
        jwt.sign({ user: foundUser.username, id: foundUser._id }, jwtKey, { expiresIn: '1h' }, function(err, token) {
          if (err) {
            res.sendStatus(403);
          } else {
            res.json({
              token: token,
              id: foundUser._id
            });
          }
        });
      }
    }
  });
  req.logout();
});

//register user route
router.post('/api/user/register', (req, res) => {
  User.find({username: req.body.username}, (err, user) => {
    if (err) {
      res.sendStatus(500);
    } else {
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
    }
  });
});

//get user data route
router.get('/api/user/:id', middleware.verifyToken, (req, res) => {
  if (req.params.id !== req.authData.id) {
    res.sendStatus(500);
  } else {
    User.findOne({_id: req.authData.id}, (err, foundUser) => {
      if (err) {
        res.sendStatus(500);
      } else {
        res.json({
          username: foundUser.username,
          first_name: foundUser.user.first_name,
          last_name: foundUser.user.last_name,
          email: foundUser.user.email
        });
      }
    });
  }
});

//update user route
router.put('/api/user/:id', middleware.verifyToken, (req, res) => {
  if (req.params.id !== req.authData.id) {
    res.sendStatus(500);
  } else {
    if (!req.body.user.first_name || !req.body.user.last_name || !req.body.user.email) {
      res.sendStatus(500);
    } else {
      User.findOneAndUpdate({_id: req.authData.id}, {user: req.body.user}, {new: true}, (err, updatedUser) => {
        if (err) {
          res.sendStatus(500);
        } else {
          res.json({data: updatedUser.user});
        }
      });
    }
  }
});

//update user password route
router.put('/api/user/:id/password', middleware.verifyToken, (req, res) => {
  if (req.params.id !== req.authData.id) {
    res.sendStatus(500);
  } else {
    if (!req.body.oldpw || !req.body.newpw) {
      res.sendStatus(500);
    } else {
      User.findOne({_id: req.authData.id}, (err, foundUser) => {
        if (err) {
          res.sendStatus(500);
        } else {
          foundUser.changePassword(req.body.oldpw, req.body.newpw, (err) => {
            if (err) {
              res.sendStatus(500);
            } else {
              res.json({message: 'Password updated!'});
            }
          });
        }
      });
    }
  }
});

//delete user route, will set user to is_active: false and user won't be able to login
//system will have to purge all not active user data after set period of days
router.delete('/api/user/:id', middleware.verifyToken, (req, res) => {
  if (req.params.id !== req.authData.id) {
    res.sendStatus(500);
  } else {
    User.findOneAndUpdate({_id: req.authData.id}, {is_active: false}, {new: true}, (err, updatedUser) => {
      if (err) {
        res.sendStatus(500);
      } else {
        res.json({message: `User ${updatedUser.username} deleted.`});
      }
    });
  }
});

module.exports = router;