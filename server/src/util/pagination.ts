import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm'

export interface PaginationOptions {
  page: number
  limit: number
  offset?: number
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  offset: number
}

export async function paginate<
  T extends Record<string, any> & { createdAt?: Date },
>(
  repo: Repository<T>,
  where?: FindOptionsWhere<T>,
  options?: PaginationOptions,
) {
  const { page = 1, limit = 10, offset = 0 } = options || {}
  const skip = offset || (page - 1) * limit

  const [items, total] = await repo.findAndCount({
    order: { createdAt: 'DESC' } as FindOptionsOrder<T>,
    where,
    skip,
    take: limit,
  })

  const totalPages = Math.ceil(total / limit)
  const hasNextPage = skip + items.length < total
  const hasPreviousPage = page > 1

  return {
    items,
    total,
    page,
    limit,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    offset: skip,
  }
}
