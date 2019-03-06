const express = require("express");
const router = express.Router();
const middleware = require('../middleware/middleware');
const Transaction = require('../models/transaction');
const User = require('../models/user');

router.post('/api/transaction', middleware.verifyToken, (req, res) => {
  Transaction.create({name: req.body.name, amount: req.body.amount}, (err, newTransaction) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      User.findOne({_id: req.authData.id}, (err, user) => {
        if (err) {
          console.log(err);
          res.sendStatus(500);
        } else {
          user.transactions.push(newTransaction);
          user.save((err, userData) => {
            if (err) {
              console.log(err);
              res.sendStatus(500);
            } else {
              res.json({
                message: 'Transaction created!',
                newTransaction,
                userData
              });
            }
          });
        }
      });
    }
  });
});




module.exports = router;