import { useEffect, useState } from 'react'
import OrderForm from '../components/OrderForm'
import OrderTable from '../components/OrderTable'
import CustomerService from '../services/customerService'
import OrderService from '../services/orderService'
import ProductService from '../services/productService'

const ORDER_STATES = ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado']

const getErrorMessage = (error, fallback) => {
  return error?.response?.data?.message || fallback
}

function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const loadOrders = async () => {
    const response = await OrderService.getAll()
    setOrders(response.data?.data || [])
  }

  const loadBaseData = async () => {
    try {
      setLoading(true)
      setErrorMessage('')

      const [ordersResponse, customersResponse, productsResponse] = await Promise.all([
        OrderService.getAll(),
        CustomerService.getAll(),
        ProductService.getAll(),
      ])

      setOrders(ordersResponse.data?.data || [])
      setCustomers(customersResponse.data?.data || [])
      setProducts(productsResponse.data?.data || [])
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'No se pudieron cargar los datos de pedidos.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBaseData()
  }, [])

  const handleCreateOrder = async (payload) => {
    try {
      setSubmitting(true)
      setErrorMessage('')
      setSuccessMessage('')

      await OrderService.create(payload)
      await loadOrders()
      setSuccessMessage('Pedido creado correctamente.')
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'No se pudo crear el pedido.'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleChangeStatus = async (order) => {
    const currentStatus = order?.estado || 'pendiente'
    const optionsText = ORDER_STATES.join(', ')
    const nextStatus = window.prompt(
      `Estado actual: ${currentStatus}.\nIngresa el nuevo estado (${optionsText}):`,
      currentStatus
    )

    if (!nextStatus) {
      return
    }

    const normalizedStatus = nextStatus.trim().toLowerCase()
    if (!ORDER_STATES.includes(normalizedStatus)) {
      setErrorMessage('Estado invalido. Debe ser pendiente, procesando, enviado, entregado o cancelado.')
      return
    }

    try {
      setErrorMessage('')
      setSuccessMessage('')
      const orderId = order._id || order.id
      const response = await OrderService.updateStatus(orderId, { estado: normalizedStatus })
      const updated = response.data?.data

      setOrders((prev) => prev.map((item) => (item._id === orderId ? updated : item)))
      setSuccessMessage('Estado actualizado correctamente.')
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'No se pudo cambiar el estado del pedido.'))
    }
  }

  const handleDelete = async (order) => {
    const orderId = order?._id || order?.id
    if (!orderId) {
      return
    }

    const confirmed = window.confirm('¿Seguro que deseas eliminar este pedido?')
    if (!confirmed) {
      return
    }

    try {
      setErrorMessage('')
      setSuccessMessage('')
      await OrderService.remove(orderId)
      setOrders((prev) => prev.filter((item) => item._id !== orderId))
      setSuccessMessage('Pedido eliminado correctamente.')
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'No se pudo eliminar el pedido.'))
    }
  }

  return (
    <section className="page-card">
      <h1>Pedidos</h1>

      {errorMessage ? <p>{errorMessage}</p> : null}
      {successMessage ? <p>{successMessage}</p> : null}

      <OrderForm
        customers={customers}
        products={products}
        onSubmit={handleCreateOrder}
        onCancel={() => {
          setErrorMessage('')
          setSuccessMessage('')
        }}
        isSubmitting={submitting}
      />

      <hr />

      {loading ? (
        <p>Cargando pedidos...</p>
      ) : (
        <OrderTable
          orders={orders}
          onChangeStatus={handleChangeStatus}
          onDelete={handleDelete}
        />
      )}
    </section>
  )
}

export default OrdersPage
