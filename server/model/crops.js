const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'farmer', required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    unit: { type: String, required: true },
    quantity: { type: Number, required: true },
    harvestDate: {type: String, required: true},
    cropName: { type: String, required: true },
    description: { type: String, required: true },
    category: {type: String, required: true}
});

const Crop = mongoose.model('Crop', cropSchema);

module.exports = Crop;