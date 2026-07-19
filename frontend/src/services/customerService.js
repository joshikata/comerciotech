import http from './api'

const CustomerService = {
  getAll() {
    return http.get('/api/customers')
  },

  getById(id) {
    return http.get(`/api/customers/${id}`)
  },

  create(payload) {
    return http.post('/api/customers', payload)
  },

  update(id, payload) {
    return http.put(`/api/customers/${id}`, payload)
  },

  remove(id) {
    return http.delete(`/api/customers/${id}`)
  },
}

export default CustomerService
