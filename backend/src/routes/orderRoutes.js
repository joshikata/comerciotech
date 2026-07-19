const express = require("express");
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");

const router = express.Router();

// Crea un nuevo pedido.
router.post("/", createOrder);
// Lista todos los pedidos.
router.get("/", getOrders);
// Obtiene un pedido por su ID.
router.get("/:id", getOrderById);
// Cambia el estado de un pedido por su ID.
router.patch("/:id/status", updateOrderStatus);
// Elimina un pedido por su ID.
router.delete("/:id", deleteOrder);

module.exports = router;
