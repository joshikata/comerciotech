import http from './api'

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
