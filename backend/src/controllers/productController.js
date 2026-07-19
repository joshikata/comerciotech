const mongoose = require("mongoose");
const Product = require("../models/Product");
const { buildValidationDetails } = require("../utils/validation");

const handleProductError = (res, error, fallbackMessage) => {
  if (error.code === 11000) {
    return res.status(409).json({
      ok: false,
      message: "El SKU ya esta registrado",
      error: "DUPLICATE_SKU",
    });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({
      ok: false,
      message: "Error de validacion en los datos del producto",
      error: "VALIDATION_ERROR",
      details: buildValidationDetails(error),
    });
  }

  if (error.name === "CastError" && error.path === "_id") {
    return res.status(400).json({
      ok: false,
      message: "ID de producto invalido",
      error: "INVALID_PRODUCT_ID",
    });
  }

  return res.status(500).json({
    ok: false,
    message: fallbackMessage,
    error: error.message,
  });
};

const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    return res.status(201).json({
      ok: true,
      message: "Producto creado correctamente",
      data: product,
    });
  } catch (error) {
    return handleProductError(res, error, "No se pudo crear el producto");
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    return res.status(200).json({
      ok: true,
      message: "Productos obtenidos correctamente",
      count: products.length,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "No se pudieron listar los productos",
      error: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        ok: false,
        message: "ID de producto invalido",
        error: "INVALID_PRODUCT_ID",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        ok: false,
        message: "Producto no encontrado",
        error: "PRODUCT_NOT_FOUND",
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Producto obtenido correctamente",
      data: product,
    });
  } catch (error) {
    return handleProductError(res, error, "No se pudo obtener el producto");
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        ok: false,
        message: "ID de producto invalido",
        error: "INVALID_PRODUCT_ID",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({
        ok: false,
        message: "Producto no encontrado",
        error: "PRODUCT_NOT_FOUND",
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Producto actualizado correctamente",
      data: updatedProduct,
    });
  } catch (error) {
    return handleProductError(res, error, "No se pudo actualizar el producto");
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        ok: false,
        message: "ID de producto invalido",
        error: "INVALID_PRODUCT_ID",
      });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        ok: false,
        message: "Producto no encontrado",
        error: "PRODUCT_NOT_FOUND",
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Producto eliminado correctamente",
      data: deletedProduct,
    });
  } catch (error) {
    return handleProductError(res, error, "No se pudo eliminar el producto");
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
