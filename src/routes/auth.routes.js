const express = require("express");

const router = express.Router();

const {
   register,
  login,
  getMe,
  updateMe,
  logout
} = require("../controllers/auth.controller");

const { protect } = require("../middleware/auth.middleware");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// profile
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);

module.exports = router;