const jwt = require("jsonwebtoken");
const User = require("../models/User");
const blacklist = require("../utils/tokenBlacklist");

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "Not authorized, no token"
      });
    }

    //  check blacklist
    if (blacklist.has(token)) {
      return res.status(401).json({
        message: "Token expired (logged out)"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found"
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      message: "Not authorized, token failed"
    });
  }
};