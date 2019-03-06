const mongoose = require('mongoose');
const User = require('../models/user');

const transactionSchema = new mongoose.Schema({
  name: String,
  amount: Number
});

module.exports = mongoose.model('Transaction', transactionSchema);