import { useEffect, useMemo, useState } from 'react'

const EMPTY_ITEM = {
  productoId: '',
  cantidad: 1,
}

const EMPTY_FORM = {
  clienteId: '',
  direccionEnvio: '',
  productos: [EMPTY_ITEM],
}

function getProductById(products, productId) {
  return products.find((item) => (item._id || item.id) === productId)
}

function normalizeInitialData(initialData) {
  if (!initialData) {
    return EMPTY_FORM
  }

  const productos = (initialData.productos || []).map((item) => ({
    productoId:
      (typeof item.producto === 'object' ? item.producto?._id || item.producto?.id : item.producto) ||
      '',
    cantidad: item.cantidad || 1,
  }))

  return {
    clienteId:
      (typeof initialData.cliente === 'object'
        ? initialData.cliente?._id || initialData.cliente?.id
        : initialData.cliente) || '',
    direccionEnvio: initialData.direccionEnvio || '',
    productos: productos.length ? productos : [EMPTY_ITEM],
  }
}

function OrderForm({
  customers = [],
  products = [],
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setFormData(normalizeInitialData(initialData))
    setErrors({})
  }, [initialData])

  const estimatedTotal = useMemo(() => {
    return formData.productos.reduce((acc, item) => {
      const product = getProductById(products, item.productoId)
      const price = Number(product?.precio || 0)
      const quantity = Number(item.cantidad || 0)
      return acc + price * quantity
    }, 0)
  }, [formData.productos, products])

  const validate = () => {
    const nextErrors = {}

    if (!formData.clienteId) {
      nextErrors.clienteId = 'Debes seleccionar un cliente.'
    }

    if (!formData.productos.length) {
      nextErrors.productos = 'Debes agregar al menos un producto.'
    }

    formData.productos.forEach((item, index) => {
      if (!item.productoId) {
        nextErrors[`producto-${index}`] = 'Selecciona un producto.'
      }

      const qty = Number(item.cantidad)
      if (!Number.isFinite(qty) || qty < 1) {
        nextErrors[`cantidad-${index}`] = 'La cantidad debe ser mayor o igual a 1.'
      }
    })

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const updateItem = (index, key, value) => {
    setFormData((prev) => {
      const nextItems = [...prev.productos]
      nextItems[index] = {
        ...nextItems[index],
        [key]: value,
      }

      return {
        ...prev,
        productos: nextItems,
      }
    })

    const errorKey = key === 'productoId' ? `producto-${index}` : `cantidad-${index}`
    if (errors[errorKey]) {
      setErrors((prev) => ({
        ...prev,
        [errorKey]: '',
      }))
    }
  }

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      productos: [...prev.productos, { ...EMPTY_ITEM }],
    }))
  }

  const removeItem = (index) => {
    setFormData((prev) => {
      const nextItems = prev.productos.filter((_, idx) => idx !== index)
      return {
        ...prev,
        productos: nextItems.length ? nextItems : [{ ...EMPTY_ITEM }],
      }
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!validate()) {
      return
    }

    const payload = {
      cliente: formData.clienteId,
      direccionEnvio: formData.direccionEnvio.trim(),
      productos: formData.productos.map((item) => ({
        producto: item.productoId,
        cantidad: Number(item.cantidad),
      })),
      totalEstimado: estimatedTotal,
    }

    onSubmit?.(payload)
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2>{initialData ? 'Editar pedido' : 'Nuevo pedido'}</h2>

      <div>
        <label htmlFor="clienteId">Cliente</label>
        <select
          id="clienteId"
          name="clienteId"
          value={formData.clienteId}
          onChange={(event) =>
            setFormData((prev) => ({
              ...prev,
              clienteId: event.target.value,
            }))
          }
        >
          <option value="">Selecciona un cliente</option>
          {customers.map((customer) => {
            const id = customer._id || customer.id
            const fullName = `${customer.nombre || ''} ${customer.apellido || ''}`.trim()

            return (
              <option key={id} value={id}>
                {fullName || customer.correo || id}
              </option>
            )
          })}
        </select>
        {errors.clienteId ? <p>{errors.clienteId}</p> : null}
      </div>

      <div>
        <label htmlFor="direccionEnvio">Direccion de envio</label>
        <input
          id="direccionEnvio"
          name="direccionEnvio"
          type="text"
          value={formData.direccionEnvio}
          onChange={(event) =>
            setFormData((prev) => ({
              ...prev,
              direccionEnvio: event.target.value,
            }))
          }
        />
      </div>

      <div>
        <h3>Productos</h3>

        {formData.productos.map((item, index) => {
          const selectedProduct = getProductById(products, item.productoId)
          const subtotal = Number(selectedProduct?.precio || 0) * Number(item.cantidad || 0)

          return (
            <div key={`${item.productoId}-${index}`}>
              <label htmlFor={`producto-${index}`}>Producto</label>
              <select
                id={`producto-${index}`}
                value={item.productoId}
                onChange={(event) => updateItem(index, 'productoId', event.target.value)}
              >
                <option value="">Selecciona un producto</option>
                {products.map((product) => {
                  const id = product._id || product.id
                  return (
                    <option key={id} value={id}>
                      {product.nombre} - ${product.precio}
                    </option>
                  )
                })}
              </select>
              {errors[`producto-${index}`] ? <p>{errors[`producto-${index}`]}</p> : null}

              <label htmlFor={`cantidad-${index}`}>Cantidad</label>
              <input
                id={`cantidad-${index}`}
                type="number"
                min="1"
                value={item.cantidad}
                onChange={(event) => updateItem(index, 'cantidad', event.target.value)}
              />
              {errors[`cantidad-${index}`] ? <p>{errors[`cantidad-${index}`]}</p> : null}

              <p>Subtotal estimado: ${subtotal}</p>

              <button type="button" onClick={() => removeItem(index)}>
                Quitar producto
              </button>
            </div>
          )
        })}

        {errors.productos ? <p>{errors.productos}</p> : null}

        <button type="button" onClick={addItem}>
          Agregar producto
        </button>
      </div>

      <p>Total estimado: ${estimatedTotal}</p>

      <div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : initialData ? 'Guardar cambios' : 'Crear pedido'}
        </button>
        <button type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </button>
      </div>
    </form>
  )
}

export default OrderForm
