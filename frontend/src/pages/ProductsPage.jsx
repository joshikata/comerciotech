import { useEffect, useState } from 'react'
import ProductForm from '../components/ProductForm'
import ProductTable from '../components/ProductTable'
import ProductService from '../services/productService'
import { getApiErrorMessage } from '../utils/errors'

function ProductsPage() {
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const loadProducts = async () => {
    try {
      setErrorMessage('')
      const response = await ProductService.getAll()
      setProducts(response.data?.data || [])
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'No se pudieron cargar los productos.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const handleCreateOrUpdate = async (payload) => {
    try {
      setSubmitting(true)
      setErrorMessage('')
      setSuccessMessage('')

      if (selectedProduct?._id) {
        const response = await ProductService.update(selectedProduct._id, payload)
        const updated = response.data?.data

        setProducts((prev) =>
          prev.map((item) => (item._id === selectedProduct._id ? updated : item))
        )
        setSuccessMessage('Producto actualizado correctamente.')
      } else {
        const response = await ProductService.create(payload)
        const created = response.data?.data

        setProducts((prev) => [created, ...prev])
        setSuccessMessage('Producto creado correctamente.')
      }

      setSelectedProduct(null)
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'No se pudo guardar el producto.'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = async (product) => {
    const productId = product?._id || product?.id
    if (!productId) {
      return
    }

    try {
      setErrorMessage('')
      setSuccessMessage('')
      const response = await ProductService.getById(productId)
      setSelectedProduct(response.data?.data || product)
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'No se pudo obtener el producto.'))
    }
  }

  const handleDelete = async (product) => {
    const productId = product?._id || product?.id
    if (!productId) {
      return
    }

    const confirmed = window.confirm('¿Seguro que deseas eliminar este producto?')
    if (!confirmed) {
      return
    }

    try {
      setErrorMessage('')
      setSuccessMessage('')
      await ProductService.remove(productId)
      setProducts((prev) => prev.filter((item) => item._id !== productId))
      setSelectedProduct((prev) => (prev?._id === productId ? null : prev))
      setSuccessMessage('Producto eliminado correctamente.')
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'No se pudo eliminar el producto.'))
    }
  }

  const handleCancel = () => {
    setSelectedProduct(null)
    setErrorMessage('')
  }

  return (
    <section className="page-card">
      <h1>Productos</h1>

      {errorMessage ? <p>{errorMessage}</p> : null}
      {successMessage ? <p>{successMessage}</p> : null}

      <div style={{ marginBottom: '1rem' }}>
        <button type="button" onClick={() => setSelectedProduct(null)}>
          Nuevo producto
        </button>
      </div>

      <ProductForm
        initialData={selectedProduct}
        onSubmit={handleCreateOrUpdate}
        onCancel={handleCancel}
        isSubmitting={submitting}
      />

      <hr />

      {loading ? (
        <p>Cargando productos...</p>
      ) : (
        <ProductTable
          products={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </section>
  )
}

export default ProductsPage
