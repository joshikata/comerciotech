const express = require("express");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

router.post("/api/products", createProduct);
router.get("/api/products", getProducts);
router.get("/api/products/:id", getProductById);
router.put("/api/products/:id", updateProduct);
router.delete("/api/products/:id", deleteProduct);

module.exports = router;
