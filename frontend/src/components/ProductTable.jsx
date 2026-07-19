function ProductTable({ products, onEdit, onDelete }) {
  return (
    <table>
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
                <button type="button" onClick={() => onEdit?.(product)}>
                  Editar
                </button>
                <button type="button" onClick={() => onDelete?.(product)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5">No hay productos para mostrar.</td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

export default ProductTable
