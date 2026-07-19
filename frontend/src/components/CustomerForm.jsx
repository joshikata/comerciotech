import { useEffect, useState } from 'react'

const EMPTY_FORM = {
  nombre: '',
  apellido: '',
  correo: '',
  telefono: '',
}

const isValidEmail = (value) => /^\S+@\S+\.\S+$/.test(value)

function CustomerForm({ initialData, onSubmit, onCancel, isSubmitting = false }) {
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || '',
        apellido: initialData.apellido || '',
        correo: initialData.correo || '',
        telefono: initialData.telefono || '',
      })
      setErrors({})
      return
    }

    setFormData(EMPTY_FORM)
    setErrors({})
  }, [initialData])

  const validate = () => {
    const nextErrors = {}

    if (!formData.nombre.trim()) {
      nextErrors.nombre = 'El nombre es obligatorio.'
    }

    if (!formData.apellido.trim()) {
      nextErrors.apellido = 'El apellido es obligatorio.'
    }

    if (!formData.correo.trim()) {
      nextErrors.correo = 'El correo es obligatorio.'
    } else if (!isValidEmail(formData.correo)) {
      nextErrors.correo = 'Ingresa un correo valido.'
    }

    if (formData.telefono && formData.telefono.trim().length < 7) {
      nextErrors.telefono = 'El telefono debe tener al menos 7 caracteres.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
      apellido: formData.apellido.trim(),
      correo: formData.correo.trim().toLowerCase(),
      telefono: formData.telefono.trim(),
    }

    onSubmit?.(payload)
  }

  const title = initialData ? 'Editar cliente' : 'Nuevo cliente'
  const submitLabel = initialData ? 'Guardar cambios' : 'Crear cliente'

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

      <div className="form-field">
        <label htmlFor="apellido">Apellido</label>
        <input
          id="apellido"
          name="apellido"
          type="text"
          value={formData.apellido}
          onChange={handleChange}
          aria-invalid={Boolean(errors.apellido)}
        />
        {errors.apellido ? <p className="form-error">{errors.apellido}</p> : null}
      </div>

      <div className="form-field form-field-full">
        <label htmlFor="correo">Correo</label>
        <input
          id="correo"
          name="correo"
          type="email"
          value={formData.correo}
          onChange={handleChange}
          aria-invalid={Boolean(errors.correo)}
        />
        {errors.correo ? <p className="form-error">{errors.correo}</p> : null}
      </div>

      <div className="form-field form-field-full">
        <label htmlFor="telefono">Telefono</label>
        <input
          id="telefono"
          name="telefono"
          type="text"
          value={formData.telefono}
          onChange={handleChange}
          aria-invalid={Boolean(errors.telefono)}
        />
        {errors.telefono ? <p className="form-error">{errors.telefono}</p> : null}
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

export default CustomerForm
