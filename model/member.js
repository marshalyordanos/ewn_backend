const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
      unique: true,
    },
    username: {
      type: String,
      require: true,
    },
    residence_address: {
      type: String,
      require: true,
    },
    phone: {
      type: String,
      require: true,
    },
    employ_type: {
      type: String,
      require: true,
    },
    memberType: {
      type: String,
      require: false,
    },
    benefitType: {
      type: String,
      require: false,
    },
    graduate_date: {
      type: String,
      require: false,
    },
    company_name: {
      type: String,
      require: false,
    },
    job_title: {
      type: String,
      require: false,
    },
    year: {
      type: String,
      require: false,
    },
    business: {
      type: String,
      require: false,
    },
    photo: {
      type: String,
      require: false,
    },
    organization: {
      type: String,
      require: false,
    },
    education: {
      type: String,
      require: true,
    },
    expertis_area: {
      type: String,
      require: false,
    },
    interest_area: {
      type: String,
      require: false,
    },
    signature: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    admin: {
      type: Boolean,
      default: false,
    },
    payments: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Payment",
      },
    ],
    Aprove: {
      type: String,
      require: false,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Member", MemberSchema);
