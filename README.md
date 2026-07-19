# ComercioTech

Aplicación full stack para la gestión de clientes, productos y pedidos.

El proyecto está dividido en:
- Backend REST API con Node.js, Express y MongoDB (Mongoose).
- Frontend SPA con React + Vite.

Incluye operaciones CRUD para clientes y productos, y gestión de pedidos con cambio de estado y validaciones de stock.

## Tecnologías Utilizadas

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- dotenv
- cors
- nodemon

### Frontend
- React
- Vite
- React Router
- Axios

### Tooling
- concurrently
- oxlint

## Estructura de Carpetas

```text
comerciotech/
├─ backend/
│  ├─ src/
│  │  ├─ config/
│  │  │  └─ db.js
│  │  ├─ controllers/
│  │  │  ├─ customerController.js
│  │  │  ├─ orderController.js
│  │  │  └─ productController.js
│  │  ├─ middlewares/
│  │  │  └─ errorHandler.js
│  │  ├─ models/
│  │  │  ├─ Customer.js
│  │  │  ├─ Order.js
│  │  │  └─ Product.js
│  │  ├─ routes/
│  │  │  ├─ customerRoutes.js
│  │  │  ├─ orderRoutes.js
│  │  │  └─ productRoutes.js
│  │  ├─ utils/
│  │  │  └─ validation.js
│  │  ├─ seed.js
│  │  └─ server.js
│  ├─ .env.example
│  └─ package.json
├─ frontend/
│  ├─ public/
│  ├─ src/
│  │  ├─ assets/
│  │  ├─ components/
│  │  ├─ pages/
│  │  ├─ services/
│  │  ├─ utils/
│  │  ├─ App.jsx
│  │  └─ main.jsx
│  ├─ vite.config.js
│  └─ package.json
├─ package.json
└─ .gitignore
```

## Instalación

### 1) Clonar repositorio

```bash
git clone https://github.com/joshikata/comerciotech.git
cd comerciotech
```

### 2) Instalar dependencias

Instalar dependencias del proyecto raíz:

```bash
npm install
```

Instalar dependencias del backend:

```bash
cd backend
npm install
cd ..
```

Instalar dependencias del frontend:

```bash
cd frontend
npm install
cd ..
```

## Variables de Entorno

### Backend

Crear el archivo `backend/.env` basado en `backend/.env.example`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/comerciotech
```

### Frontend

Opcionalmente puedes definir `VITE_API_URL` para apuntar a otra URL de API.
Si no se define, el frontend usa por defecto:

```text
http://localhost:5000
```

## Inicio Rápido Recomendado

Para evitar errores de carga en el frontend, inicia backend y frontend juntos desde la raíz del proyecto:

```bash
npm run dev
```

Este comando ejecuta ambos servicios en paralelo:
- Backend en http://localhost:5000
- Frontend en http://localhost:5173

## Cómo Ejecutar Backend

Opcionalmente, si quieres iniciar solo el backend, usa la carpeta `backend` (modo desarrollo):

```bash
npm run dev
```

Modo producción/local simple:

```bash
npm start
```

Backend disponible en:

```text
http://localhost:5000
```

## Cómo Ejecutar Frontend

Opcionalmente, si quieres iniciar solo el frontend, usa la carpeta `frontend`:

```bash
npm run dev
```

Frontend disponible típicamente en:

```text
http://localhost:5173
```

Nota importante:
- Si el frontend muestra mensajes como No se pudieron cargar los clientes, verifica que el backend esté ejecutándose en http://localhost:5000.

## Cómo Ejecutar Seed

Desde la carpeta `backend`:

```bash
npm run seed
```

El seed:
- Limpia colecciones de clientes, productos y pedidos.
- Inserta 30 clientes, 30 productos y 30 pedidos de ejemplo.
- Ajusta stock según pedidos generados.

## Endpoints Disponibles

Base URL backend: `http://localhost:5000`

### Health
- `GET /api/health` - Estado del backend.

### Customers
- `POST /api/customers` - Crear cliente.
- `GET /api/customers` - Listar clientes.
- `GET /api/customers/:id` - Obtener cliente por ID.
- `PUT /api/customers/:id` - Actualizar cliente por ID.
- `DELETE /api/customers/:id` - Eliminar cliente por ID.

### Products
- `POST /api/products` - Crear producto.
- `GET /api/products` - Listar productos.
- `GET /api/products/:id` - Obtener producto por ID.
- `PUT /api/products/:id` - Actualizar producto por ID.
- `DELETE /api/products/:id` - Eliminar producto por ID.

### Orders
- `POST /api/orders` - Crear pedido.
- `GET /api/orders` - Listar pedidos.
- `GET /api/orders/:id` - Obtener pedido por ID.
- `PATCH /api/orders/:id/status` - Cambiar estado del pedido.
- `DELETE /api/orders/:id` - Eliminar pedido por ID.

## Capturas

Agrega aquí las capturas de la aplicación.

### Home
![Home](docs/screenshots/home.png)

### Clientes
![Clientes](docs/screenshots/clientes.png)

### Productos
![Productos](docs/screenshots/productos.png)

### Pedidos
![Pedidos](docs/screenshots/pedidos.png)

## Scripts Útiles (Raíz)

Desde la raíz del proyecto:

```bash
npm run dev
```

Ejecuta backend y frontend en paralelo usando `concurrently`.
