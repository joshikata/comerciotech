import { useEffect, useState } from 'react'

const EMPTY_FORM = {
  nombre: '',
  descripcion: '',
  categoria: '',
  precio: '',
  stock: '',
  sku: '',
  activo: true,
}

function ProductForm({ initialData, onSubmit, onCancel, isSubmitting = false }) {
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || '',
        descripcion: initialData.descripcion || '',
        categoria: initialData.categoria || '',
        precio:
          initialData.precio === 0 || initialData.precio
            ? String(initialData.precio)
            : '',
        stock:
          initialData.stock === 0 || initialData.stock
            ? String(initialData.stock)
            : '',
        sku: initialData.sku || '',
        activo:
          typeof initialData.activo === 'boolean' ? initialData.activo : true,
      })
      setErrors({})
      return
    }

    setFormData(EMPTY_FORM)
    setErrors({})
  }, [initialData])

  const validate = () => {
    const nextErrors = {}
    const precioNumber = Number(formData.precio)
    const stockNumber = Number(formData.stock)

    if (!formData.nombre.trim()) {
      nextErrors.nombre = 'El nombre es obligatorio.'
    }

    if (!formData.categoria.trim()) {
      nextErrors.categoria = 'La categoria es obligatoria.'
    }

    if (!formData.sku.trim()) {
      nextErrors.sku = 'El SKU es obligatorio.'
    }

    if (formData.precio === '') {
      nextErrors.precio = 'El precio es obligatorio.'
    } else if (Number.isNaN(precioNumber) || precioNumber < 0) {
      nextErrors.precio = 'El precio debe ser un numero mayor o igual a 0.'
    }

    if (formData.stock === '') {
      nextErrors.stock = 'El stock es obligatorio.'
    } else if (Number.isNaN(stockNumber) || stockNumber < 0) {
      nextErrors.stock = 'El stock debe ser un numero mayor o igual a 0.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!validate()) {
      return
    }

    const payload = {
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim(),
      categoria: formData.categoria.trim(),
      precio: Number(formData.precio),
      stock: Number(formData.stock),
      sku: formData.sku.trim().toUpperCase(),
      activo: formData.activo,
    }

    onSubmit?.(payload)
  }

  const title = initialData ? 'Editar producto' : 'Nuevo producto'
  const submitLabel = initialData ? 'Guardar cambios' : 'Crear producto'

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <h2 className="form-title">{title}</h2>

      <div className="form-grid">
      <div className="form-field">
        <label htmlFor="nombre">Nombre</label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          value={formData.nombre}
          onChange={handleChange}
          aria-invalid={Boolean(errors.nombre)}
        />
        {errors.nombre ? <p className="form-error">{errors.nombre}</p> : null}
      </div>

      <div className="form-field form-field-full">
        <label htmlFor="descripcion">Descripcion</label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          rows="3"
        />
      </div>

      <div className="form-field">
        <label htmlFor="categoria">Categoria</label>
        <input
          id="categoria"
          name="categoria"
          type="text"
          value={formData.categoria}
          onChange={handleChange}
          aria-invalid={Boolean(errors.categoria)}
        />
        {errors.categoria ? <p className="form-error">{errors.categoria}</p> : null}
      </div>

      <div className="form-field">
        <label htmlFor="precio">Precio</label>
        <input
          id="precio"
          name="precio"
          type="number"
          min="0"
          step="0.01"
          value={formData.precio}
          onChange={handleChange}
          aria-invalid={Boolean(errors.precio)}
        />
        {errors.precio ? <p className="form-error">{errors.precio}</p> : null}
      </div>

      <div className="form-field">
        <label htmlFor="stock">Stock</label>
        <input
          id="stock"
          name="stock"
          type="number"
          min="0"
          step="1"
          value={formData.stock}
          onChange={handleChange}
          aria-invalid={Boolean(errors.stock)}
        />
        {errors.stock ? <p className="form-error">{errors.stock}</p> : null}
      </div>

      <div className="form-field">
        <label htmlFor="sku">SKU</label>
        <input
          id="sku"
          name="sku"
          type="text"
          value={formData.sku}
          onChange={handleChange}
          aria-invalid={Boolean(errors.sku)}
        />
        {errors.sku ? <p className="form-error">{errors.sku}</p> : null}
      </div>

      <div className="form-field checkbox-row form-field-full">
        <label htmlFor="activo">
          <input
            id="activo"
            name="activo"
            type="checkbox"
            checked={formData.activo}
            onChange={handleChange}
          />
          Activo
        </label>
      </div>
      </div>

      <div className="form-actions">
        <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : submitLabel}
        </button>
        <button className="btn btn-secondary" type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </button>
      </div>
    </form>
  )
}

export default ProductForm
