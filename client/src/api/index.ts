import { PaginatedResponse, PaginationOptions } from "./pagination"

export interface ApiType<T extends { id: string }> {
  pagination: (params?: PaginationOptions, ...args: any[]) => Promise<PaginatedResponse<T>>
  create: (data: Partial<T>, ...args: any[]) => Promise<T>
  update: (id: string, data: Partial<T>, ...args: any[]) => Promise<T>
  delete: (id: string) => Promise<void>
  getItem: (id: string) => Promise<T | null>
}