export interface PaginationOptions {
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  offset: number
}