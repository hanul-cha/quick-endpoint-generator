import type { Endpoint } from '@/types/endpoint'
import { api } from '@/api/api'

interface EndpointListParams {
  page?: number
  limit?: number
}

export const endpointApi = {
  async getMyEndpoints(params: EndpointListParams = {}) {
    const response = await api.get('/endpoints', { params })
    return response.data
  },

  async createEndpoint(data: Partial<Endpoint>) {
    const response = await api.post('/endpoints', data)
    return response.data
  },

  async updateEndpoint(id: string, data: Partial<Endpoint>) {
    const response = await api.put(`/endpoints/${id}`, data)
    return response.data
  },

  async deleteEndpoint(id: string) {
    await api.delete(`/endpoints/${id}`)
  }
}