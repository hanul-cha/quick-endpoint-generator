import type { DataTable } from '../types/data-table'
import { api } from './client'

interface PaginationOptions {
  page?: number
  limit?: number
}

interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  offset: number
}

export const tableApi = {
  getTables: (options?: PaginationOptions) => {
    const params = new URLSearchParams()
    if (options?.page) params.append('page', options.page.toString())
    if (options?.limit) params.append('limit', options.limit.toString())
    return api.get<PaginatedResponse<DataTable>>(`/data-tables?${params.toString()}`)
  },

  getMyTables: (options?: PaginationOptions) => {
    const params = new URLSearchParams()
    if (options?.page) params.append('page', options.page.toString())
    if (options?.limit) params.append('limit', options.limit.toString())
    return api.get<PaginatedResponse<DataTable>>(`/data-tables/my?${params.toString()}`)
  },

  getTable: (tableId: string) =>
    api.get<DataTable>(`/data-tables/${tableId}`),

  createTable: (table: Partial<DataTable>) =>
    api.post<DataTable>('/data-tables', table),

  updateTable: (tableId: string, table: Partial<DataTable>) =>
    api.put<DataTable>(`/data-tables/${tableId}`, table),

  deleteTable: (tableId: string) =>
    api.delete<void>(`/data-tables/${tableId}`),
}