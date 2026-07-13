const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");

const {
  getProfile,
  updateProfile,
  changePassword,
} = require("../controllers/user.controller");

const {
  validateUpdateProfile,
  validateChangePassword,
} = require("../validators/user.validator");

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, validateUpdateProfile, updateProfile);
router.put(
  "/change-password",
  authMiddleware,
  validateChangePassword,
  changePassword
);

module.exports = router;
