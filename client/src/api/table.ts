import { PaginatedResponse, PaginationOptions } from './pagination'

import type { DataTable } from '../types/data-table'
import { DefaultApi } from '.'
import { api } from './client'

class TableApi extends DefaultApi<DataTable> {
  async pagination(options?: PaginationOptions) {
    const params = new URLSearchParams()
    if (options?.page) params.append('page', options.page.toString())
    if (options?.limit) params.append('limit', options.limit.toString())
    return api.get<PaginatedResponse<DataTable>>(`/data-tables/my?${params.toString()}`)
  }

  async getItem(tableId: string) {
    const response = await api.get<DataTable | null>(`/data-tables/${tableId}`)
    return response
  }

  async create(data: Partial<DataTable>) {
    const response = await api.post<DataTable>('/data-tables', data)
    return response
  }

  async update(id: string, data: Partial<DataTable>) {
    const response = await api.put<DataTable>(`/data-tables/${id}`, data)
    return response
  }

  async delete(id: string) {
    await api.delete<void>(`/data-tables/${id}`)
  }
}

export const tableApi = new TableApi()