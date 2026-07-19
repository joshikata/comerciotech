import { useEffect, useState } from 'react'
import CustomerForm from '../components/CustomerForm'
import CustomerTable from '../components/CustomerTable'
import CustomerService from '../services/customerService'

const getErrorMessage = (error, fallback) => {
  return error?.response?.data?.message || fallback
}

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
      setErrorMessage(getErrorMessage(error, 'No se pudieron cargar los clientes.'))
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
      setErrorMessage(getErrorMessage(error, 'No se pudo guardar el cliente.'))
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
      setErrorMessage(getErrorMessage(error, 'No se pudo obtener el cliente.'))
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
      setErrorMessage(getErrorMessage(error, 'No se pudo eliminar el cliente.'))
    }
  }

  const handleCancel = () => {
    setSelectedCustomer(null)
    setErrorMessage('')
  }

  return (
    <section className="page-card">
      <h1>Clientes</h1>

      {errorMessage ? <p>{errorMessage}</p> : null}
      {successMessage ? <p>{successMessage}</p> : null}

      <div style={{ marginBottom: '1rem' }}>
        <button type="button" onClick={() => setSelectedCustomer(null)}>
          Nuevo cliente
        </button>
      </div>

      <CustomerForm
        initialData={selectedCustomer}
        onSubmit={handleCreateOrUpdate}
        onCancel={handleCancel}
        isSubmitting={submitting}
      />

      <hr />

      {loading ? (
        <p>Cargando clientes...</p>
      ) : (
        <CustomerTable
          customers={customers}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </section>
  )
}

export default CustomersPage
