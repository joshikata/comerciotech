const mongoose = require("mongoose");
const Customer = require("../models/Customer");

const createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create(req.body);

    return res.status(201).json({
      ok: true,
      message: "Cliente creado correctamente",
      data: customer,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: "No se pudo crear el cliente",
      error: error.message,
    });
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
      });
    }

    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({
        ok: false,
        message: "Cliente no encontrado",
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Cliente obtenido correctamente",
      data: customer,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "No se pudo obtener el cliente",
      error: error.message,
    });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        ok: false,
        message: "ID de cliente invalido",
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
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Cliente actualizado correctamente",
      data: updatedCustomer,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: "No se pudo actualizar el cliente",
      error: error.message,
    });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        ok: false,
        message: "ID de cliente invalido",
      });
    }

    const deletedCustomer = await Customer.findByIdAndDelete(id);

    if (!deletedCustomer) {
      return res.status(404).json({
        ok: false,
        message: "Cliente no encontrado",
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Cliente eliminado correctamente",
      data: deletedCustomer,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "No se pudo eliminar el cliente",
      error: error.message,
    });
  }
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
