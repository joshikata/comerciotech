import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const http = axios.create({
  baseURL,
})

const OrderService = {
  getAll() {
    return http.get('/api/orders')
  },

  getById(id) {
    return http.get(`/api/orders/${id}`)
  },

  create(payload) {
    return http.post('/api/orders', payload)
  },

  updateStatus(id, payload) {
    return http.patch(`/api/orders/${id}/status`, payload)
  },

  remove(id) {
    return http.delete(`/api/orders/${id}`)
  },
}

export default OrderService
