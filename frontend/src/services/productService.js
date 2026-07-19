import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const http = axios.create({
  baseURL,
})

const ProductService = {
  getAll() {
    return http.get('/api/products')
  },

  getById(id) {
    return http.get(`/api/products/${id}`)
  },

  create(payload) {
    return http.post('/api/products', payload)
  },

  update(id, payload) {
    return http.put(`/api/products/${id}`, payload)
  },

  remove(id) {
    return http.delete(`/api/products/${id}`)
  },
}

export default ProductService
