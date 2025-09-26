const {generateOTP, sendotp, storeOtp, validateOtp} = require("../services/otpgen");
const farmer = require("../model/farmer");
const Order = require("../model/order")
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');


const sendVerificationEmail =  async(req, res) =>{
    const {email} = req.body;

    if(!email){
        return res.status(400).json({message: "Email is required"});
    }

    const otp = generateOTP();
    storeOtp(email, otp);
    try {
        await sendotp(email, otp);
        res.status(200).json({message: "OTP sent to email"});   
    } catch (error) {
        res.status(500).json({message: "Error sending OTP email"});
    }
}

const verifyOtp = (req, res ) => {
    const {email, otp} = req.body;

    if(!email ||!otp){
        return res.status(400).json({message: "Email and OTP are required"});
    }
  
    if(validateOtp(email, otp)){
        return res.status(200).json({message: "OTP is valid"});
        
    }else{
        return res.status(400).json({message: "Invalid OTP"});
    }
};

const submitform = async (req, res) => {
  const { name, email, password, phone, farmName, farmLocation, img, gender, role } = req.body;

  // Check if all fields are provided
  if (!name || !email || !password || !phone || !farmName || !farmLocation || !img) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if the farmer already exists in the database
    const existingFarmer = await farmer.findOne({ email });
    if (existingFarmer) {
      return res.status(400).json({ message: "Farmer with this email already exists" });
    }

    // Check if the image is a valid Base64 string
    if (img.startsWith("data:image/")) {
      // Remove the base64 header from the image string
      const base64Data = img.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
      const imagePath = path.join(__dirname, '../uploads/people', `${Date.now()}.jpg`);

      // Write the decoded Base64 image data to a file
      fs.writeFileSync(imagePath, base64Data, 'base64');


      const hashpassword = await bcrypt.hash(password, 12)
      // Create a new farmer document
      const newFarmer = new farmer({
        name,
        email,
        password: hashpassword,
        phone,
        gender,
        role,
        farmName,
        farmLocation,
        profile: `/uploads/people/${path.basename(imagePath)}`,  // Save the image path
      });

      // Save the farmer data to MongoDB
      await newFarmer.save();

      // Send a successful response
      res.status(201).json({ message: "Farmer registered successfully",
        newFarmer: {
            name: newFarmer.name,
            email: newFarmer.email,
            phone: newFarmer.phone,
            farmName: newFarmer.farmName,
            farmLocation: newFarmer.farmLocation,
            profile: newFarmer.profile,
            gender: newFarmer.gender,
            role: newFarmer.role
        }
       });

    } else {
      return res.status(400).json({ message: "Invalid image format" });
    }

  } catch (error) {
    // Catch any errors and send an error response
    console.error('Error saving data to MongoDB:', error);
    res.status(500).json({ message: 'Error saving data to MongoDB', error });
  }
};

const farmerLogin = async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "Email and Password are required" });
  }

  try {
    const existingFarmer = await farmer.findOne({ email });
    if (!existingFarmer) {
      return res.status(400).json({ message: "Farmer with this email does not exist" });
    }

    const isMatch = await bcrypt.compare(password, existingFarmer.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Save only safe fields in session
    req.session.user = {
      _id: existingFarmer._id,
      name: existingFarmer.name,
      profile: existingFarmer.profile,
      role: existingFarmer.role,
    };

    return res.json({
      status: "ok",
      userType: existingFarmer.role,
      farmerId: existingFarmer._id,
      user: req.session.user,
      message: "Login successful",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in farmer" });
  }
};

const sendVerificationEmailRest = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Check if user with the email exists
    const user = await farmer.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    // Email exists — generate OTP and send
    const otp = generateOTP();
    await storeOtp(email, otp); // assuming this is async
    await sendotp(email, otp);

    res.status(200).json({ message: "OTP sent to email", otp });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Error sending OTP email" });
  }
};

const resetPassword = async (req, res) => {
  const {email, password} = req.body;

  if(!email || !password){
    return res.status(400).json({message: "All fields are required!!!"});
  }

  try {

    const existingPerson = await farmer.findOne({email});
    if(!existingPerson){
      return res.status(400).json({message: "Person with this email doesn't exists"});
    }

    const hashpassword = await bcrypt.hash(password, 12);
    existingPerson.password = hashpassword;
    await existingPerson.save();

    res.status(200).json({message:"Password reset Successfully!!!"})

    
  } catch (error) {
    console.error("Error changing password", error);
    return res.status(500).json({message: "Server Error"})
  }

}

// Get full user info
const getuserinfo = async (req, res) => {
  try {
    // Check if user is logged in
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const farmerId = req.session.user._id;

    // Fetch latest farmer details from DB (exclude password & __v)
    const farmerData = await farmer.findById(farmerId).select("-password -__v");

    if (!farmerData) {
      return res.status(404).json({ message: "Farmer not found" });
    }

    return res.status(200).json({
      user: farmerData,
    });
  } catch (error) {
    console.error("Error fetching user info:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


const logout = async (req, res) => {
  req.session.destroy((err) => {
    if(err){
        return res.status(500).json({message: "Error logging out"});
    }
    res.clearCookie('connect.sid'); //Clear the Session cookie
    res.status(200).json({message: "Logged out successfully"});
  })
}
 
// Get Farmer Profile
const getFarmerProfile = async (req, res) => {
  try {
    // check if user is logged in
    if (!req.session.user) {
      return res.status(401).json({ message: "Please Login first" });
    }

    const farmerId = req.session.user._id;

    // fetch farmer details
    const farmerData = await farmer.findById(farmerId).select(
      "-password -__v" // exclude password & version
    );

    if (!farmerData) {
      return res.status(404).json({ message: "Farmer not found" });
    }

    return res.status(200).json({
      message: "Farmer details fetched successfully",
      farmer: farmerData,
    });
  } catch (error) {
    console.error("Error fetching farmer profile:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


const updateFarmerProfile = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized Please Login To View" });
    }

    const farmerId = req.session.user._id;
    if (!farmerId) {
      return res.status(400).json({ message: "Farmer ID missing" });
    }

    // Fetch current farmer to preserve required fields
    const existingFarmer = await farmer.findById(farmerId);
    if (!existingFarmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }

    // Build updateData safely (merge with old values)
    const { name, gender, phone, farmName, farmLocation, profile } = req.body;

    const updateData = {
      name: name ?? existingFarmer.name,
      gender: gender ?? existingFarmer.gender, // ✅ keep old gender if not sent
      phone: phone ?? existingFarmer.phone,
      farmName: farmName ?? existingFarmer.farmName,
      farmLocation: farmLocation ?? existingFarmer.farmLocation,
    };

    // 🟢 NEW: handle base64 image (same as crops API)
    if (profile && profile.startsWith("data:image/")) {
      const base64Data = profile.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      const fileName = `${Date.now()}.jpg`;
      const uploadDir = path.join(__dirname, "../uploads/people");

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);

      updateData.profile = `/uploads/people/${fileName}`;
    } else if (req.file && req.file.filename) {
      // 🟢 keep multer option too (if formData is used)
      updateData.profile = `/uploads/people/${req.file.filename}`;
    }

    const updatedFarmer = await farmer.findByIdAndUpdate(
      farmerId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password -__v");

    req.session.user = {
      _id: updatedFarmer._id,
      name: updatedFarmer.name,
      profile: updatedFarmer.profile,
      role: updatedFarmer.role,
    };

    return res.status(200).json({
      message: "Profile updated successfully",
      farmer: updatedFarmer,
    });
  } catch (error) {
    console.error("❌ Error updating farmer profile:", error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
};


const getCompletedOrders = async (req, res) => {
  try {
    const farmerId = req.session.user?._id

    if(!farmerId){
      return res.status(401).json({message:"Unauthorized Please Login first"})
    }

    const completedOrders = await Order.find({
      farmerId: farmerId,
      status: "Delivered"
    })
    .select("OrderId date orderId totalAmount buyerId status updatedAt")
    .populate("buyerId", "name")

    res.status(200).json({ success: true, completedOrders})

  } catch (error) {
    console.error(error);
    res.status(500).json({message:"Server Error", error: error.message})
  }
}



module.exports = {sendVerificationEmail, getFarmerProfile ,verifyOtp, submitform, farmerLogin,
   logout, getuserinfo, updateFarmerProfile, getCompletedOrders,sendVerificationEmailRest ,resetPassword};