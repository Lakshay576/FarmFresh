const { error } = require('console');
const crops = require('../model/crops');
const fs = require('fs');
const path = require('path');

const cropdetails = async (req, res) => {
  const { image, price, unit, quantity, harvestDate, cropName, description, category } = req.body;

  console.log("addCrop called with body:", req.body);

  // 🔒 Check session user
  if (!req.session.user || !req.session.user._id) {
    console.error("No logged-in user in session");
    return res.status(401).json({ message: "Unauthorized: user not logged in" });
  }

  // ✅ Validate required fields
  if (!image || !price || !unit || !quantity || !harvestDate || !cropName || !description || !category) {
    console.error("Missing fields:", {
      image, price, unit, quantity, harvestDate, cropName, description, category
    });
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    let imagePath = null;

    if (image.startsWith('data:image/')) {
      const base64Data = image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
      const fileName = `${Date.now()}.jpg`;
      const uploadDir = path.join(__dirname, '../uploads/crops');

      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const imgPath = path.join(uploadDir, fileName);
      fs.writeFileSync(imgPath, base64Data, 'base64');

      imagePath = `/uploads/crops/${fileName}`; // This will be stored in DB
    } else {
      return res.status(400).json({ message: "Invalid image format" });
    }

    // 📦 Create new crop
    const newCrop = new crops({
      farmerId: req.session.user._id,
      image: imagePath,
      price,
      unit,
      quantity,
      harvestDate,
      cropName,
      description,
      category
    });

    const saved = await newCrop.save();
    console.log("New crop saved:", saved);

    return res.status(201).json({
      message: "Crop added successfully",
      newCrop: saved
    });

  } catch (err) {
    console.error("Error in cropdetails:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


const showcrops = async (req, res) =>{
    try{
        const {farmerId} = req.params;
        const allcrops =  await crops.find({farmerId});
        res.status(200).json({success: true, allcrops});
    }catch(err){
        return res.status(500).json({message: "Server error"});
    }
}

const removecrop = async (req, res) =>{
    const {cropId } = req.params;
    try {
        const crop = await crops.findById(cropId);
        if(!crop){
            res.status(404).json({message: "Crop not found"})
        }
        await crops.findByIdAndDelete(cropId);
        res.status(200).json({message: "Crop deleted successfully"});
    } catch (error) {
        console.error("Error deleting crop:", error);
        return res.status(500).json({message: "Server error"});
    }
}

const viewcrop = async (req, res) => {
    const { cropId } = req.params;
    try {
        const crop = await crops.findById(cropId).populate('farmerId', "email profile phone name farmLocation farmName");
        if (!crop) {
            return res.status(404).json({ message: "Crop not found" });
        }
        return res.status(200).json({ success: true, crop });
    } catch (error) {
        console.error("Error viewing crop:", error);
        return res.status(500).json({ message: "Server error while viewing crop" });
    }
};

const updatecrop = async (req, res) => {
    const { cropId } = req.params;
    const updateCrop = { ...req.body };

    console.log("Received update for crop:", cropId);
    console.log("Update data:", updateCrop);

    try {
        // Convert fields to proper types
        if (updateCrop.price) updateCrop.price = parseFloat(updateCrop.price);
        if (updateCrop.quantity) updateCrop.quantity = parseInt(updateCrop.quantity);
        if (updateCrop.harvestDate) updateCrop.harvestDate = new Date(updateCrop.harvestDate);

        // ✅ Handle base64 image if a new image is uploaded
        if (updateCrop.image && updateCrop.image.startsWith("data:image/")) {
            const base64Data = updateCrop.image.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');
            const fileName = `${Date.now()}.jpg`;
            const uploadDir = path.join(__dirname, '../uploads/crops');

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const filePath = path.join(uploadDir, fileName);
            fs.writeFileSync(filePath, buffer);

            // Store relative path in DB
            updateCrop.image = `/uploads/crops/${fileName}`;
        } else {
            // ✅ Remove image key if no new image is provided
            delete updateCrop.image;
        }

        // Update crop in DB
        const crop = await crops.findByIdAndUpdate(
            cropId,
            { $set: updateCrop },
            { new: true, runValidators: true }
        );

        if (!crop) {
            return res.status(404).json({ message: "Crop not found" });
        }

        return res.status(200).json({ success: true, message: "Crop Updated Successfully", crop });
    } catch (error) {
        console.error("Error updating crop:", error);
        return res.status(500).json({ message: "Server error while updating crop", error: error.message });
    }
};

const viewAllCrops = async (req, res) => {
  try{
    const allcrops = await crops.find().populate('farmerId', "email phone name farmLocation farmName");
    res.status(200).json({success: true, allcrops })
  }catch{
    console.error("Error fetching all crops", error);
    res.status(500).json({success: false, message: "server error", error: error.message})
  }
};


module.exports = {cropdetails, showcrops, removecrop, viewcrop, updatecrop, viewAllCrops };