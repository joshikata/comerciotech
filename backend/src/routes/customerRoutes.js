const express = require("express");
const {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");

const router = express.Router();

// Crea un nuevo cliente.
router.post("/", createCustomer);
// Lista todos los clientes.
router.get("/", getCustomers);
// Obtiene un cliente por su ID.
router.get("/:id", getCustomerById);
// Actualiza un cliente por su ID.
router.put("/:id", updateCustomer);
// Elimina un cliente por su ID.
router.delete("/:id", deleteCustomer);

module.exports = router;
