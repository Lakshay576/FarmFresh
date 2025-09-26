const mongoose = require('mongoose');   

const farmerSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    gender: {type: String, required: true},
    role: {type: String, enum:['farmer', 'buyer'], required: true},
    password: {type: String, required: true},
    phone: {type: String, required: true},
    farmName: {type: String, required: true},
    farmLocation: {type: String, required: true},
    profile: {type: String, required: true}
});

const farmer = mongoose.model('farmer', farmerSchema);

module.exports = farmer;