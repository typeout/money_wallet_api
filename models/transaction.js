const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  name: String,
  amount: Number,
  user:
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    }
});

module.exports = mongoose.model('Transaction', transactionSchema);