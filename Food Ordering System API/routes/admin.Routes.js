const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  adminRegister,
  adminLogin,
  adminProfile,
  adminChangePassword,
  adminForgetPassword,
  fetchAdmin,
  deleteAdmin,
  updateAdmin,
  updateStatus,
} = require("../controllers/auth.Controller");

// Register a new admin
router.post("/register", adminRegister);

// Admin login route
router.post("/login", adminLogin);

// Get admin profile, protected by auth middleware
router.get("/profile", auth, adminProfile);

// Change admin password, protected by auth middleware
router.put("/change-password", auth, adminChangePassword);

// Admin forget password route, no auth needed
router.post("/forget-password", adminForgetPassword);

// Fetch all admins, protected by auth middleware
router.get("/fetchAdmin", auth, fetchAdmin);

// Update admin details, protected by auth middleware
router.put("/update/:id", auth, updateAdmin);

// Update admin status, protected by auth middleware
router.put("/status", auth, updateStatus);

// Delete an admin, protected by auth middleware
router.delete("/:id", auth, deleteAdmin);

// Export the router to be used in the main app 
module.exports = router;
