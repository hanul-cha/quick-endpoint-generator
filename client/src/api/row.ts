import { PaginatedResponse, PaginationOptions } from './pagination'

import type { DataRow } from '@/types/data-row'
import { api } from './client'

export const rowApi = {
  async getRows(tableId: string, params: PaginationOptions = {}): Promise<PaginatedResponse<DataRow>> {
    const searchParams = new URLSearchParams()
    if (params.page) searchParams.append('page', params.page.toString())
    if (params.limit) searchParams.append('limit', params.limit.toString())
    if (tableId) searchParams.append('dataTableId', tableId)
    const response = await api.get<PaginatedResponse<DataRow>>(`/data-rows/my?${searchParams.toString()}`)
    return response
  },

  async getRow(rowId: string): Promise<DataRow> {
    const response = await api.get<DataRow>(`/data-rows/${rowId}`)
    return response
  },

  async createRow(tableId: string, values: DataRow['values']) {
    const response = await api.post<DataRow>(`/data-rows`, {
      dataTableId: tableId,
      values
    })
    return response
  },

  async updateRow(rowId: string, values: DataRow['values']) {
    const response = await api.put<DataRow>(`/data-rows/${rowId}`, values)
    return response
  },

  async deleteRow(rowId: string) {
    await api.delete<void>(`/data-rows/${rowId}`)
  }
}
