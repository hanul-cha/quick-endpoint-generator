import { PaginatedResponse, PaginationOptions } from "./pagination"

export interface ApiType<T extends { id: string }> {
  pagination: (params?: PaginationOptions, ...args: any[]) => Promise<PaginatedResponse<T>>
  create: (data: Partial<T>, ...args: any[]) => Promise<T>
  update: (id: string, data: Partial<T>, ...args: any[]) => Promise<T>
  delete: (id: string) => Promise<void>
  getItem: (id: string) => Promise<T | null>
}

export abstract class DefaultApi<T extends { id: string }> implements ApiType<T> {
  abstract pagination(params?: PaginationOptions, ...args: any[]): Promise<PaginatedResponse<T>>
  abstract create(data: Partial<T>, ...args: any[]): Promise<T>
  abstract update(id: string, data: Partial<T>, ...args: any[]): Promise<T>
  abstract delete(id: string): Promise<void>
  abstract getItem(id: string): Promise<T | null>
}