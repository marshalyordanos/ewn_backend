const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    price: String,
    note: String,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "posts must have a user"],
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", PaymentSchema);
module.exports = Payment;
