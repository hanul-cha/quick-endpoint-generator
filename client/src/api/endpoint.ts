import { PaginatedResponse, PaginationOptions } from './pagination'

import { DefaultApi } from '.'
import type { Endpoint } from '@/types/endpoint'
import { api } from './client'

class EndpointApi extends DefaultApi<Endpoint> {
  async pagination(params: PaginationOptions = {}): Promise<PaginatedResponse<Endpoint>> {
    const searchParams = new URLSearchParams()
    if (params.page) searchParams.append('page', params.page.toString())
    if (params.limit) searchParams.append('limit', params.limit.toString())
    const response = await api.get<PaginatedResponse<Endpoint>>(`/endpoints/my?${searchParams.toString()}`)
    return response
  }

  async create(data: Partial<Endpoint>) {
    const response = await api.post<Endpoint>('/endpoints', data)
    return response
  }

  async update(id: string, data: Partial<Endpoint>) {
    const response = await api.put<Endpoint>(`/endpoints/${id}`, data)
    return response
  }

  async delete(id: string) {
    await api.delete<void>(`/endpoints/${id}`)
  }

  async getItem(id: string) {
    const response = await api.get<Endpoint | null>(`/endpoints/${id}`)
    return response
  }
}

export const endpointApi = new EndpointApi()