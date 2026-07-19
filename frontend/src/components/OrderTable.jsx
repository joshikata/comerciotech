function formatDate(value) {
  if (!value) {
    return '-'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return '-'
  }

  return date.toLocaleDateString('es-CL')
}

function getCustomerName(order) {
  if (typeof order.cliente === 'object' && order.cliente) {
    const nombre = order.cliente.nombre || ''
    const apellido = order.cliente.apellido || ''
    const fullName = `${nombre} ${apellido}`.trim()
    return fullName || '-'
  }

  return order.cliente || '-'
}

function OrderTable({ orders, onChangeStatus, onDelete }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Cliente</th>
          <th>Total</th>
          <th>Estado</th>
          <th>Fecha</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {orders?.length ? (
          orders.map((order) => (
            <tr key={order._id || order.id}>
              <td>{getCustomerName(order)}</td>
              <td>{order.total ?? '-'}</td>
              <td>{order.estado || '-'}</td>
              <td>{formatDate(order.fechaPedido || order.createdAt)}</td>
              <td>
                <button type="button" onClick={() => onChangeStatus?.(order)}>
                  Cambiar estado
                </button>
                <button type="button" onClick={() => onDelete?.(order)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5">No hay pedidos para mostrar.</td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

export default OrderTable
