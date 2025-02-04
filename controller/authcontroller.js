const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET_KEY, PASSWORD } = require("../utils/config");
const nodemailer = require("nodemailer");
const authController = {
  register: async (request, response) => {
    try {
      const { name, email, password } = request.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return response
          .status(400)
          .json({ message: "the user already exist please login" });
      }
      const PasswordHash = await bcrypt.hash(password, 10);
      const newUser = new User({
        name,
        email,
        password: PasswordHash,
      });
      await newUser.save();
      response.json({ message: "user registered sucessfully" });
    } catch (error) {
      response.status(500).json({ message: error.message });
    }
  },

  authenticate: async (request, response) => {
    try {
      const { email, password } = request.body;
      const user = await User.findOne({ email });
      if (!user) {
        return response
          .status(404)
          .json({ message: "no user found please sign up" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return response
          .status(401)
          .json({ message: "please enter correct password" });
      }
      const token = await jwt.sign(
        {
          id: user._id,
        },
        SECRET_KEY
      );
      response.json({ token, message: "user logged in sucessfully" });
    } catch (error) {
      response.status(500).json({ message: error.message });
    }
  },

  //
  me: async (request, response) => {
    try {
      const userId = request.userId;
      const user = await User.findById(userId).select(
        "-password -createdAt -updatedAt -__v"
      );

      response.json(user);
    } catch (error) {
      response.status(500).json({ message: error.message });
    }
  },
  resetPassword: async (request, response) => {
    try {
      const { email } = request.body;
      const user = await User.findOne({ email });
      if (!user) {
        return response.status(404).json({ message: "user not found" });
      }
      const token = Math.random().toString(36).slice(-8);
      user.resetPassword = token;
      user.resetPasswordExpires = Date.now() + 3600000;
      await user.save();
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "dharsanmb3@gmail.com",
          pass: dlkyeldctzrmtlup,
        },
      });
      const message = {
        from: "dharsanmb3@gmail.com",
        to: user.email,
        subject: "passsword reset",
        text: `reset the password for your account \n\n please use the following token to reset the password :${token}`,
      };
      transporter.sendMail(message, (err, info) => {
        if (err) {
          response.status(404).json({ message: "something went wrong " });
        }
        response.status(200).json({ message: "password reset email sent" });
      });
    } catch {
      response.status(500).json({ message: error.message });
    }
  },
  // changepassword
  changePassword: async (request, response) => {
    try {
      const { code, password } = request.body;
      const user = await User.findOne({
        resetPassword: code,
        resetPasswordExpires: { $gt: Date.now() },
      });
      if (!user) {
        return response
          .status(404)
          .json({ message: "Invalid or expired reset code" });
      }
      const hashPassword = await bcrypt.hash(password, 10);
      user.password = hashPassword;
      user.resetPassword = null;
      user.resetPasswordExpires = null;
      await user.save();
      response
        .status(200)
        .json({ message: "Password has been successfully reset" });
    } catch (error) {
      console.error("Error during password reset:", error.message);
      response.status(500).json({ message: "Internal server error" });
    }
  },
};
module.exports = authController;
