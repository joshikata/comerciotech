function CustomerTable({ customers, onEdit, onDelete }) {
  return (
    <div className="table-wrap">
      <table className="table">
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
                  <div className="row-actions">
                    <button className="btn btn-secondary" type="button" onClick={() => onEdit?.(customer)}>
                      Editar
                    </button>
                    <button className="btn btn-danger" type="button" onClick={() => onDelete?.(customer)}>
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="empty-row" colSpan="4">No hay clientes para mostrar.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default CustomerTable
