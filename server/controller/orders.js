const Order = require("../model/order");
const Counter = require("../model/counter");
const farmer = require("../model/farmer");
const Crop = require("../model/crops");

const orderIdGenerator = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: "order" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const serial = counter.seq.toString().padStart(3, "0");
  return `#SW${serial}`;
};

const createOrder = async (req, res) => {
  try {
    if (!req.session.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized. Please login and then continue." });
    }

    const { farmerId, items, totalAmount } = req.body;
    const buyerId = req.session.user._id;

    if (!farmerId || !items || items.length === 0) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    // ✅ FIX: Ensure farmerId is included in each item
    const detailedItems = await Promise.all(
      items.map(async (item) => {
        const crop = await Crop.findById(item.cropId);
        if (!crop) throw new Error(`Crop not found: ${item.cropId}`);
        return {
          cropId: crop._id,
          name: crop.cropName,
          price: item.price || crop.price,
          quantity: item.quantity,
          unit: crop.unit,
          farmerId: crop.farmerId, // ✅ FIX
        };
      })
    );

    const orderId = await orderIdGenerator();

    const newOrder = new Order({
      orderId,
      farmerId,
      buyerId,
      items: detailedItems,
      totalAmount,
      status: "Pending",
    });

    await newOrder.save();

    return res
      .status(200)
      .json({ success: true, message: "Order created", order: newOrder });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

// const updateOrderStatus = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { status } = req.body || {};

//     const order = await Order.findOne({ orderId });
//     if (!order) return res.status(404).json({ message: "Order not found" });

//     if (order.farmerId.toString() !== req.session.user._id.toString())
//       return res.status(403).json({ message: "Forbidden" });

//     order.status = status;
//     await order.save();

//     return res.status(200).json({ success: true, message: "Order updated", order });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Missing status" });
    }

    const order = await Order.findOne({
      $or: [
        { orderId: orderId },      // for string-based IDs like "#SW001"
        { _id: orderId }           // for MongoDB _id
      ]
    }).populate("buyerId", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Optional: Ensure that only the owning farmer can update
    if (order.farmerId.toString() !== req.session.user?._id?.toString() &&
        order.buyerId._id.toString() !== req.session.user?._id?.toString()) {
      return res.status(403).json({ message: "Forbidden: You are not authorized to update this order" });
    }

    // ✅ Set the new status
    order.status = status;

    // ✅ Set timeline date
    const now = new Date();
    switch (status.toLowerCase()) {
      case "confirmed":
        order.orderTimeline.confirmedAt = now;
        break;
      case "shipped":
        order.orderTimeline.shippedAt = now;
        break;
      case "out for delivery":
        order.orderTimeline.outForDeliveryAt = now;
        break;
      case "delivered":
        order.orderTimeline.deliveredAt = now;
        break;
      // Optional: add cancelled, returned etc.
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order
    });

  } catch (err) {
    console.error("Error updating order status:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};


const getFarmerOrders = async (req, res) => {
  try {
    if (!req.session.user || !req.session.user._id) {
      return res.status(401).json({ message: "Unauthorized. Please login" });
    }
    const farmerId = req.session.user._id;
    const orders = await Order.find({ farmerId }).populate("buyerId", "name  email phone farmLocation")
          .populate("items.cropId", "cropName image price unit"); 

    return res.status(200).json({ success: true, orders });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


const placedOrders = async ( req, res) => {
  try {
    if(!req.session.user || !req.session.user._id){
      return res.status(401).json({status:false, message: "You must be login"})
    }
    const buyerId = req.session.user._id;
    const orders = await Order.find({buyerId})
      .populate("items.cropId", "cropName image price unit")
      .populate("farmerId", "farmName ")
      .populate("buyerId", "farmLocation")
      .sort({ createdAt: -1 });

      res.status(200).json({success: true, orders})
  } catch (error) {
     console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}



module.exports = { createOrder, updateOrderStatus, getFarmerOrders, placedOrders };
