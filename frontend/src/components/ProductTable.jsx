function ProductTable({ products, onEdit, onDelete }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Categoria</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products?.length ? (
            products.map((product) => (
              <tr key={product._id || product.id}>
                <td>{product.nombre}</td>
                <td>{product.categoria}</td>
                <td>{product.precio}</td>
                <td>{product.stock}</td>
                <td>
                  <div className="row-actions">
                    <button className="btn btn-secondary" type="button" onClick={() => onEdit?.(product)}>
                      Editar
                    </button>
                    <button className="btn btn-danger" type="button" onClick={() => onDelete?.(product)}>
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="empty-row" colSpan="5">No hay productos para mostrar.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default ProductTable
