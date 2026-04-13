const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const passport = require("passport");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const candidate = await User.findOne({ email });
    if (candidate) {
      return res.status(400).json({
        message: "Such email is already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ name, email, password: hashedPassword });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
    console.log(error);
  }
};

const login = (req, res, next) =>
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);

const logout = (req, res, next) => {
  req.logout((error) => {
    if (error) return next(error);
  });
  res.render("login", {
    success_msg: "You are logged out",
  });
};

module.exports = { register, login, logout };
