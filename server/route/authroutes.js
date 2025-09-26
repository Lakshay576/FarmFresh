const express = require("express");
const router = express.Router();
const { sendVerificationEmail, verifyOtp, submitform, getFarmerProfile, farmerLogin, logout, getuserinfo, 
  updateFarmerProfile, getCompletedOrders, resetPassword , sendVerificationEmailRest} = require("../controller/farmerSignup");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.get("/", (req, res) => res.send("Server is up and running!"));
router.post("/send-otp", sendVerificationEmail);
router.post("/verify-otp", verifyOtp);
router.post("/register-farmer", upload.single("profile"), submitform);
router.post("/login-farmer", farmerLogin);
router.get("/userinfo", getuserinfo);
router.post("/logout", logout);
router.get("/getFamerProfile", getFarmerProfile); // <-- FIXED typo
router.put("/updateFarmerProfile", upload.single("profile"), updateFarmerProfile); // <-- added multer for image
router.get('/getCompletedOrders', getCompletedOrders);
router.post('/sendverifycode', sendVerificationEmailRest);
router.put('/resetpassword', resetPassword);


module.exports = router;
