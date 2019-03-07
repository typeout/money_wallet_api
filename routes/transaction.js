const express = require("express");
const router = express.Router();
const middleware = require('../middleware/middleware');
const Transaction = require('../models/transaction');
const User = require('../models/user');

router.post('/api/transaction', middleware.verifyToken, (req, res) => {
  if (!req.body.transaction) {
    res.sendStatus(500);
  } else {
    User.findOne({_id: req.authData.id}, (err, user) => { 
      if (err) {
        res.sendStatus(403);
      } else {
        Transaction.create({name: req.body.transaction.name, amount: req.body.transaction.amount, user: user}, (err, newTransaction) => {
          if (err) {
            res.sendStatus(500);
          } else {
            res.json({
              _id: newTransaction._id,
              name: newTransaction.name,
              amount: newTransaction.amount
            });
          }
        });
      }
    });
  }
});

router.get('/api/transaction', middleware.verifyToken, (req, res) => {
  User.findOne({_id: req.authData.id}, (err, user) => {
    if (err) {
      res.sendStatus(403);
    } else {
      Transaction.find({user: user}, (err, allTransactions) => {
        if (err) {
          res.sendStatus(500);
        } else {
          res.json(allTransactions.map(trans => {
            let newTrans = {};
            newTrans._id = trans._id;
            newTrans.name = trans.name;
            newTrans.amount = trans.amount;
            return newTrans;
          }));
        }
      });
    }
  });
});

router.get('/api/transaction/:id', middleware.verifyToken, (req, res) => {
  Transaction.findOne({_id: req.params.id}, (err, transaction) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.json({
        _id: transaction._id,
        name: transaction.name,
        amount: transaction.amount
      });
    }
  });
});

router.put('/api/transaction/:id', middleware.verifyToken, (req, res) => {
  if (!req.body.transaction) {
    res.sendStatus(500);
  } else {
    Transaction.findOne({_id: req.params.id}, (err, foundTransaction) => {
      if (err) {
        res.sendStatus(500);
      } else {
        if (foundTransaction.user._id != req.authData.id) {
          res.sendStatus(403);
        } else {
          Transaction.findOneAndUpdate({_id: req.params.id}, {name: req.body.transaction.name, amount: req.body.transaction.amount}, {new: true}, (err, updatedTransaction) => {
            if (err) {
              res.sendStatus(500);
            } else {
              res.json({
                _id: updatedTransaction._id,
                name: updatedTransaction.name,
                amount: updatedTransaction.amount
              });
            }
          });
        }
      }
    });
  }
});

router.delete('/api/transaction/:id', middleware.verifyToken, (req, res) => {
  Transaction.findOne({_id: req.params.id}, (err, foundTransaction) => {
    if (err) {
      res.sendStatus(500);
    } else {
      if (foundTransaction.user._id != req.authData.id) {
        res.sendStatus(403);
      } else {
        Transaction.findOneAndDelete({_id: req.params.id}, (err) => {
          if (err) {
            res.sendStatus(500);
          } else {
            res.json({
              message: `Transaction ${req.params.id} deleted!`
            });
          }
        });
      }
    }
  });
});


module.exports = router;