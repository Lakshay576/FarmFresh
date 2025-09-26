const {cropdetails, showcrops, removecrop, viewcrop, viewAllCrops,updatecrop} = require('../controller/crop');
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");


const storage = multer.diskStorage({
    destination: (req, res, cb) =>{
        const uploadPath = path.join(__dirname, '../uploads/crops');
        if(!fs.existsSync(uploadPath)){
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) =>{
        cb(null, Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({storage});   




router.post("/add-crop", upload.single('image'), cropdetails);
router.get("/show-crops/farmer/:farmerId", showcrops);
router.delete("/remove-crop/:cropId", removecrop);
router.get("/view-crop/:cropId", viewcrop);
router.put("/update-crop/:cropId", upload.single('image'), updatecrop);
router.get("/viewAllCrops", viewAllCrops);

module.exports = router;    


