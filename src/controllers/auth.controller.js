const User = require("../models/User");
const bcrypt = require("bcryptjs");
const blacklist = require("../utils/tokenBlacklist");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hash
    });

    res.status(201).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(401).json({
        message: "Invalid Credentials"
      });

    const valid = await bcrypt.compare(
      password,
      user.password
    );

    if (!valid)
      return res.status(401).json({
        message: "Invalid Credentials"
      });

    const token = jwt.sign(
      {
        id: user._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d"
      }
    );

    res.json({
      token
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const { phone, address, pincode } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        phone,
        address,
        pincode
      },
      {
        new: true,
        runValidators: true
      }
    ).select("-password");

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};


exports.getMe = async (req, res) => {
  try {
    res.json({
      user: req.user
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};


exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(400).json({
        message: "No token provided"
      });
    }

    blacklist.add(token);

    res.json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};