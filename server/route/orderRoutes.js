const express = require("express");
const { createOrder,updateOrderStatus, getFarmerOrders, placedOrders } = require('../controller/orders');

const router = express.Router();

router.post('/orders', createOrder);
router.get('/farmerorders', getFarmerOrders);
router.put('/update-order-status/:orderId', updateOrderStatus);
router.get('/getPlaceOrder', placedOrders);

module.exports = router;
