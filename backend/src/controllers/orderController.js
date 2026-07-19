const mongoose = require("mongoose");
const Order = require("../models/Order");
const Customer = require("../models/Customer");
const Product = require("../models/Product");

const ORDER_STATES = [
  "pendiente",
  "procesando",
  "enviado",
  "entregado",
  "cancelado",
];

const rollbackStock = async (movements) => {
  for (const movement of movements) {
    await Product.findByIdAndUpdate(movement.productId, {
      $inc: { stock: movement.quantity },
    });
  }
};

const createOrder = async (req, res) => {
  const stockMovements = [];

  try {
    const { cliente, productos, direccionEnvio, estado } = req.body;

    if (!mongoose.Types.ObjectId.isValid(cliente)) {
      return res.status(400).json({
        ok: false,
        message: "ID de cliente invalido",
        error: "INVALID_CUSTOMER_ID",
      });
    }

    const customer = await Customer.findById(cliente);
    if (!customer) {
      return res.status(404).json({
        ok: false,
        message: "Cliente no encontrado",
        error: "CUSTOMER_NOT_FOUND",
      });
    }

    if (!Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({
        ok: false,
        message: "El pedido debe incluir al menos un producto",
        error: "EMPTY_ORDER_ITEMS",
      });
    }

    const orderItems = [];
    let orderTotal = 0;

    for (const item of productos) {
      const { producto, cantidad } = item;

      if (!mongoose.Types.ObjectId.isValid(producto)) {
        return res.status(400).json({
          ok: false,
          message: "ID de producto invalido",
          error: "INVALID_PRODUCT_ID",
        });
      }

      if (!Number.isFinite(cantidad) || cantidad < 1) {
        return res.status(400).json({
          ok: false,
          message: "La cantidad debe ser un numero mayor o igual a 1",
          error: "INVALID_QUANTITY",
        });
      }

      const product = await Product.findById(producto);

      if (!product) {
        return res.status(404).json({
          ok: false,
          message: "Producto no encontrado",
          error: "PRODUCT_NOT_FOUND",
        });
      }

      if (product.stock < cantidad) {
        return res.status(400).json({
          ok: false,
          message: `Stock insuficiente para el producto ${product.nombre}`,
          error: "INSUFFICIENT_STOCK",
        });
      }

      const updatedProduct = await Product.findOneAndUpdate(
        { _id: product._id, stock: { $gte: cantidad } },
        { $inc: { stock: -cantidad } },
        { new: true }
      );

      if (!updatedProduct) {
        await rollbackStock(stockMovements);
        return res.status(409).json({
          ok: false,
          message: `No fue posible reservar stock para ${product.nombre}`,
          error: "STOCK_RESERVATION_FAILED",
        });
      }

      stockMovements.push({
        productId: product._id,
        quantity: cantidad,
      });

      const precioUnitario = product.precio;
      const subtotal = precioUnitario * cantidad;

      orderItems.push({
        producto: product._id,
        cantidad,
        precioUnitario,
        subtotal,
      });

      orderTotal += subtotal;
    }

    const order = await Order.create({
      cliente,
      productos: orderItems,
      total: orderTotal,
      estado,
      direccionEnvio,
    });

    const populatedOrder = await Order.findById(order._id)
      .populate("cliente")
      .populate("productos.producto");

    return res.status(201).json({
      ok: true,
      message: "Pedido creado correctamente",
      data: populatedOrder,
    });
  } catch (error) {
    if (stockMovements.length > 0) {
      await rollbackStock(stockMovements);
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        ok: false,
        message: "Error de validacion al crear el pedido",
        error: error.message,
      });
    }

    return res.status(500).json({
      ok: false,
      message: "No se pudo crear el pedido",
      error: error.message,
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("cliente")
      .populate("productos.producto");

    return res.status(200).json({
      ok: true,
      message: "Pedidos obtenidos correctamente",
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "No se pudieron listar los pedidos",
      error: error.message,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        ok: false,
        message: "ID de pedido invalido",
        error: "INVALID_ORDER_ID",
      });
    }

    const order = await Order.findById(id)
      .populate("cliente")
      .populate("productos.producto");

    if (!order) {
      return res.status(404).json({
        ok: false,
        message: "Pedido no encontrado",
        error: "ORDER_NOT_FOUND",
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Pedido obtenido correctamente",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "No se pudo obtener el pedido",
      error: error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        ok: false,
        message: "ID de pedido invalido",
        error: "INVALID_ORDER_ID",
      });
    }

    if (!ORDER_STATES.includes(estado)) {
      return res.status(400).json({
        ok: false,
        message: "Estado de pedido invalido",
        error: "INVALID_ORDER_STATUS",
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { estado },
      { new: true, runValidators: true }
    )
      .populate("cliente")
      .populate("productos.producto");

    if (!updatedOrder) {
      return res.status(404).json({
        ok: false,
        message: "Pedido no encontrado",
        error: "ORDER_NOT_FOUND",
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Estado del pedido actualizado correctamente",
      data: updatedOrder,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        ok: false,
        message: "Error de validacion al actualizar el pedido",
        error: error.message,
      });
    }

    return res.status(500).json({
      ok: false,
      message: "No se pudo actualizar el estado del pedido",
      error: error.message,
    });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        ok: false,
        message: "ID de pedido invalido",
        error: "INVALID_ORDER_ID",
      });
    }

    const deletedOrder = await Order.findByIdAndDelete(id)
      .populate("cliente")
      .populate("productos.producto");

    if (!deletedOrder) {
      return res.status(404).json({
        ok: false,
        message: "Pedido no encontrado",
        error: "ORDER_NOT_FOUND",
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Pedido eliminado correctamente",
      data: deletedOrder,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "No se pudo eliminar el pedido",
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
};
