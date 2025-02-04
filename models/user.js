const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  resetPassword: String,
  resetPasswordExpires:Date,
});
module.exports = mongoose.model("Usernew", userSchema, "usersnew");
