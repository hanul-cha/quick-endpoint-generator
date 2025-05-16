import { PaginatedResponse, PaginationOptions } from './pagination'

import type { Endpoint } from '@/types/endpoint'
import { api } from './client'

export const endpointApi = {
  async getMyEndpoints(params: PaginationOptions = {}): Promise<PaginatedResponse<Endpoint>> {
    const searchParams = new URLSearchParams()
    if (params.page) searchParams.append('page', params.page.toString())
    if (params.limit) searchParams.append('limit', params.limit.toString())
    const response = await api.get<PaginatedResponse<Endpoint>>(`/endpoints/my?${searchParams.toString()}`)
    return response
  },

  async createEndpoint(data: Partial<Endpoint>) {
    const response = await api.post<Endpoint>('/endpoints', data)
    return response
  },

  async updateEndpoint(id: string, data: Partial<Endpoint>) {
    const response = await api.put<Endpoint>(`/endpoints/${id}`, data)
    return response
  },

  async deleteEndpoint(id: string) {
    await api.delete<void>(`/endpoints/${id}`)
  }
}