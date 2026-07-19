function CustomerTable({ customers, onEdit, onDelete }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Correo</th>
          <th>Telefono</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {customers?.length ? (
          customers.map((customer) => (
            <tr key={customer._id || customer.id}>
              <td>{customer.nombre}</td>
              <td>{customer.correo}</td>
              <td>{customer.telefono || '-'}</td>
              <td>
                <button type="button" onClick={() => onEdit?.(customer)}>
                  Editar
                </button>
                <button type="button" onClick={() => onDelete?.(customer)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4">No hay clientes para mostrar.</td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

export default CustomerTable
