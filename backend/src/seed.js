require("dotenv").config();

const mongoose = require("mongoose");
const Customer = require("./models/Customer");
const Product = require("./models/Product");
const Order = require("./models/Order");

const FIRST_NAMES = [
  "Ana",
  "Luis",
  "Camila",
  "Pedro",
  "Sofia",
  "Diego",
  "Valentina",
  "Javier",
  "Martina",
  "Carlos",
];

const LAST_NAMES = [
  "Gonzalez",
  "Munoz",
  "Rojas",
  "Diaz",
  "Perez",
  "Soto",
  "Contreras",
  "Silva",
  "Morales",
  "Sepulveda",
];

const CATEGORIES = [
  "Electronica",
  "Hogar",
  "Oficina",
  "Accesorios",
  "Deporte",
];

const ORDER_STATES = ["pendiente", "procesando", "enviado", "entregado"];

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const pickOne = (arr) => arr[randomInt(0, arr.length - 1)];

const pickManyDistinct = (arr, count) => {
  const copy = [...arr];
  const chosen = [];

  for (let i = 0; i < count && copy.length > 0; i += 1) {
    const idx = randomInt(0, copy.length - 1);
    chosen.push(copy[idx]);
    copy.splice(idx, 1);
  }

  return chosen;
};

const buildCustomers = () => {
  const customers = [];

  for (let i = 1; i <= 30; i += 1) {
    const nombre = pickOne(FIRST_NAMES);
    const apellido = pickOne(LAST_NAMES);

    customers.push({
      nombre,
      apellido,
      correo: `cliente${i}@comerciotech.com`,
      telefono: `+5699${String(100000 + i).padStart(6, "0")}`,
      direccion: {
        calle: `Calle ${i}`,
        numero: `${100 + i}`,
        comuna: "Centro",
        ciudad: "Santiago",
        region: "RM",
      },
      activo: true,
    });
  }

  return customers;
};

const buildProducts = () => {
  const products = [];

  for (let i = 1; i <= 30; i += 1) {
    products.push({
      nombre: `Producto ${i}`,
      descripcion: `Descripcion del producto ${i}`,
      categoria: pickOne(CATEGORIES),
      precio: randomInt(2000, 80000),
      stock: randomInt(80, 150),
      sku: `SKU-${String(i).padStart(4, "0")}`,
      activo: true,
    });
  }

  return products;
};

const buildOrders = (customers, products) => {
  const productsById = new Map(
    products.map((product) => [product._id.toString(), { ...product.toObject() }])
  );
  const stockUsage = new Map();
  const orders = [];

  for (let i = 0; i < 30; i += 1) {
    const cliente = pickOne(customers);
    const itemsCount = randomInt(1, 4);

    const availableProducts = products.filter((product) => {
      const used = stockUsage.get(product._id.toString()) || 0;
      return product.stock - used > 0;
    });

    const selectedProducts = pickManyDistinct(
      availableProducts,
      Math.min(itemsCount, availableProducts.length)
    );

    const productos = selectedProducts.map((product) => {
      const productId = product._id.toString();
      const used = stockUsage.get(productId) || 0;
      const remaining = product.stock - used;
      const cantidad = randomInt(1, Math.min(3, remaining));

      stockUsage.set(productId, used + cantidad);

      const precioUnitario = productsById.get(productId).precio;
      const subtotal = precioUnitario * cantidad;

      return {
        producto: product._id,
        cantidad,
        precioUnitario,
        subtotal,
      };
    });

    const total = productos.reduce((acc, item) => acc + item.subtotal, 0);

    orders.push({
      cliente: cliente._id,
      productos,
      total,
      estado: pickOne(ORDER_STATES),
      direccionEnvio: `Entrega ${i + 1}, Santiago`,
      fechaPedido: new Date(),
    });
  }

  return { orders, stockUsage };
};

const runSeed = async () => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    throw new Error("MONGODB_URI no esta definida en las variables de entorno");
  }

  await mongoose.connect(mongoURI);

  try {
    await Order.deleteMany({});
    await Customer.deleteMany({});
    await Product.deleteMany({});

    const customers = await Customer.insertMany(buildCustomers());
    const products = await Product.insertMany(buildProducts());

    const { orders, stockUsage } = buildOrders(customers, products);

    await Order.insertMany(orders);

    const stockUpdates = [];
    for (const [productId, usedQty] of stockUsage.entries()) {
      stockUpdates.push({
        updateOne: {
          filter: { _id: productId },
          update: { $inc: { stock: -usedQty } },
        },
      });
    }

    if (stockUpdates.length > 0) {
      await Product.bulkWrite(stockUpdates);
    }

    console.log("Seed completado con exito: 30 customers, 30 products y 30 orders creados.");
  } finally {
    await mongoose.connection.close();
  }
};

runSeed().catch((error) => {
  console.error("Error ejecutando seed:", error.message);
  process.exit(1);
});
