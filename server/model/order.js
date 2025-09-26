const mongoose = require('mongoose');

const orderItemsSchema = new mongoose.Schema({
    cropId: {type: mongoose.Schema.Types.ObjectId, ref: "Crop", required: true},
    name: {type: String, required: true},
    quantity: {type: Number, required: true},
    unit:{type: String, required: false},
    price: {type: Number, required: true},
})

const orderSchema = new mongoose.Schema({
    orderId: {type: String, unique: true},
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "farmer", required: true },
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "farmer", required: true },
    items: [orderItemsSchema],
    totalAmount: {type: String, required: true},
    status: {type: String , enum: ["Pending", "Confirmed", "Shipped","Out For Delivery" ,"Delivered", "Cancelled"], default: "Pending"},
    orderTimeline: {
    confirmedAt: { type: Date, default: null },
    shippedAt: { type: Date, default: null },
    outForDeliveryAt: { type: Date, default: null },
    deliveredAt: { type: Date, default: null },
  },
},

    {timestamps: true}
)

module.exports = mongoose.model("Order", orderSchema);
