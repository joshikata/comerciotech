import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './components/MainLayout'
import CustomersPage from './pages/CustomersPage'
import HomePage from './pages/HomePage'
import OrdersPage from './pages/OrdersPage'
import ProductsPage from './pages/ProductsPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/clientes" element={<CustomersPage />} />
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/pedidos" element={<OrdersPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
