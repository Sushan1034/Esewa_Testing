const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  bookId: String,
  userEmail: String,
  amount: Number,
  transactionUuid: String,
  status: {
    type: String,
    enum: ["PENDING", "PAID", "FAILED"],
    default: "PENDING"
  }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
