import { PaginatedResponse, PaginationOptions } from './pagination'

import { ApiType } from '.'
import type { DataRow } from '@/types/data-row'
import { api } from './client'

class RowApi implements ApiType<DataRow> {
  async pagination(params: PaginationOptions = {}, tableId: string): Promise<PaginatedResponse<DataRow>> {
    const searchParams = new URLSearchParams()
    if (params.page) searchParams.append('page', params.page.toString())
    if (params.limit) searchParams.append('limit', params.limit.toString())
    if (tableId) searchParams.append('dataTableId', tableId)
    const response = await api.get<PaginatedResponse<DataRow>>(`/data-rows/my?${searchParams.toString()}`)
    return response
  }

  async getItem(rowId: string): Promise<DataRow> {
    const response = await api.get<DataRow>(`/data-rows/${rowId}`)
    return response
  }

  async create(data: Partial<DataRow>) {
    const response = await api.post<DataRow>(`/data-rows`, {
      dataTableId: data.dataTableId,
      values: data.values
    })
    return response
  }

  async update(rowId: string, data: Partial<DataRow>) {
    const response = await api.put<DataRow>(`/data-rows/${rowId}`, data)
    return response
  }

  async delete(rowId: string) {
    await api.delete<void>(`/data-rows/${rowId}`)
  }
}

export const rowApi = new RowApi()
