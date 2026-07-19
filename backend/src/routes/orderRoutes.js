const express = require("express");
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");

const router = express.Router();

router.post("/api/orders", createOrder);
router.get("/api/orders", getOrders);
router.get("/api/orders/:id", getOrderById);
router.patch("/api/orders/:id/status", updateOrderStatus);
router.delete("/api/orders/:id", deleteOrder);

module.exports = router;
