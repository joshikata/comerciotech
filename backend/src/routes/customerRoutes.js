const express = require("express");
const {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");

const router = express.Router();

router.post("/api/customers", createCustomer);
router.get("/api/customers", getCustomers);
router.get("/api/customers/:id", getCustomerById);
router.put("/api/customers/:id", updateCustomer);
router.delete("/api/customers/:id", deleteCustomer);

module.exports = router;
