const mongoose = require("mongoose");
const Customer = require("../models/Customer");
const { buildValidationDetails } = require("../utils/validation");

const handleCustomerError = (res, error, fallbackMessage) => {
  if (error.code === 11000) {
    return res.status(409).json({
      ok: false,
      message: "El correo ya esta registrado",
      error: "DUPLICATE_EMAIL",
    });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({
      ok: false,
      message: "Error de validacion en los datos del cliente",
      error: "VALIDATION_ERROR",
      details: buildValidationDetails(error),
    });
  }

  if (error.name === "CastError" && error.path === "_id") {
    return res.status(400).json({
      ok: false,
      message: "ID de cliente invalido",
      error: "INVALID_CUSTOMER_ID",
    });
  }

  return res.status(500).json({
    ok: false,
    message: fallbackMessage,
    error: error.message,
  });
};

const createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create(req.body);

    return res.status(201).json({
      ok: true,
      message: "Cliente creado correctamente",
      data: customer,
    });
  } catch (error) {
    return handleCustomerError(res, error, "No se pudo crear el cliente");
  }
};

const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });

    return res.status(200).json({
      ok: true,
      message: "Clientes obtenidos correctamente",
      count: customers.length,
      data: customers,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "No se pudieron listar los clientes",
      error: error.message,
    });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        ok: false,
        message: "ID de cliente invalido",
        error: "INVALID_CUSTOMER_ID",
      });
    }

    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({
        ok: false,
        message: "Cliente no encontrado",
        error: "CUSTOMER_NOT_FOUND",
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Cliente obtenido correctamente",
      data: customer,
    });
  } catch (error) {
    return handleCustomerError(res, error, "No se pudo obtener el cliente");
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        ok: false,
        message: "ID de cliente invalido",
        error: "INVALID_CUSTOMER_ID",
      });
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedCustomer) {
      return res.status(404).json({
        ok: false,
        message: "Cliente no encontrado",
        error: "CUSTOMER_NOT_FOUND",
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Cliente actualizado correctamente",
      data: updatedCustomer,
    });
  } catch (error) {
    return handleCustomerError(res, error, "No se pudo actualizar el cliente");
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        ok: false,
        message: "ID de cliente invalido",
        error: "INVALID_CUSTOMER_ID",
      });
    }

    const deletedCustomer = await Customer.findByIdAndDelete(id);

    if (!deletedCustomer) {
      return res.status(404).json({
        ok: false,
        message: "Cliente no encontrado",
        error: "CUSTOMER_NOT_FOUND",
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Cliente eliminado correctamente",
      data: deletedCustomer,
    });
  } catch (error) {
    return handleCustomerError(res, error, "No se pudo eliminar el cliente");
  }
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
