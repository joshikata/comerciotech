const express = require("express");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

// Crea un nuevo producto.
router.post("/", createProduct);
// Lista todos los productos.
router.get("/", getProducts);
// Obtiene un producto por su ID.
router.get("/:id", getProductById);
// Actualiza un producto por su ID.
router.put("/:id", updateProduct);
// Elimina un producto por su ID.
router.delete("/:id", deleteProduct);

module.exports = router;
