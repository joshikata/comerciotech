import { useEffect, useState } from 'react'
import CustomerForm from '../components/CustomerForm'
import CustomerTable from '../components/CustomerTable'
import CustomerService from '../services/customerService'
import { getApiErrorMessage } from '../utils/errors'

function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const loadCustomers = async () => {
    try {
      setErrorMessage('')
      const response = await CustomerService.getAll()
      setCustomers(response.data?.data || [])
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'No se pudieron cargar los clientes.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCustomers()
  }, [])

  const handleCreateOrUpdate = async (payload) => {
    try {
      setSubmitting(true)
      setErrorMessage('')
      setSuccessMessage('')

      if (selectedCustomer?._id) {
        const response = await CustomerService.update(selectedCustomer._id, payload)
        const updated = response.data?.data

        setCustomers((prev) =>
          prev.map((item) => (item._id === selectedCustomer._id ? updated : item))
        )
        setSuccessMessage('Cliente actualizado correctamente.')
      } else {
        const response = await CustomerService.create(payload)
        const created = response.data?.data

        setCustomers((prev) => [created, ...prev])
        setSuccessMessage('Cliente creado correctamente.')
      }

      setSelectedCustomer(null)
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'No se pudo guardar el cliente.'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = async (customer) => {
    const customerId = customer?._id || customer?.id
    if (!customerId) {
      return
    }

    try {
      setErrorMessage('')
      setSuccessMessage('')
      const response = await CustomerService.getById(customerId)
      setSelectedCustomer(response.data?.data || customer)
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'No se pudo obtener el cliente.'))
    }
  }

  const handleDelete = async (customer) => {
    const customerId = customer?._id || customer?.id
    if (!customerId) {
      return
    }

    const confirmed = window.confirm('¿Seguro que deseas eliminar este cliente?')
    if (!confirmed) {
      return
    }

    try {
      setErrorMessage('')
      setSuccessMessage('')
      await CustomerService.remove(customerId)
      setCustomers((prev) => prev.filter((item) => item._id !== customerId))
      setSelectedCustomer((prev) => (prev?._id === customerId ? null : prev))
      setSuccessMessage('Cliente eliminado correctamente.')
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'No se pudo eliminar el cliente.'))
    }
  }

  const handleCancel = () => {
    setSelectedCustomer(null)
    setErrorMessage('')
  }

  return (
    <section className="page-card">
      <header className="page-header">
        <div>
          <h1 className="page-title">Clientes</h1>
          <p className="page-subtitle">Gestion y mantenimiento del registro de clientes.</p>
        </div>
      </header>

      {errorMessage ? <p className="alert alert-error">{errorMessage}</p> : null}
      {successMessage ? <p className="alert alert-success">{successMessage}</p> : null}

      <div className="toolbar">
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => setSelectedCustomer(null)}
        >
          Nuevo cliente
        </button>
      </div>

      <div className="panel">
        <CustomerForm
          initialData={selectedCustomer}
          onSubmit={handleCreateOrUpdate}
          onCancel={handleCancel}
          isSubmitting={submitting}
        />
      </div>

      <div className="panel">
        {loading ? (
          <p className="loading-text">Cargando clientes...</p>
        ) : (
          <CustomerTable
            customers={customers}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </section>
  )
}

export default CustomersPage
