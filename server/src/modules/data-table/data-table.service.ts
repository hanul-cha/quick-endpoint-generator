import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DataTable } from './data-table.entity'

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

@Injectable()
export class DataTableService {
  constructor(
    @InjectRepository(DataTable)
    private dataTableRepository: Repository<DataTable>,
  ) {}

  async create(
    name: string,
    columns: { id: string; name: string; type: string }[],
    userId?: string,
  ) {
    const dataTable = this.dataTableRepository.create({
      name,
      columns,
      userId,
    })
    return await this.dataTableRepository.save(dataTable)
  }

  async findAll(
    options?: PaginationOptions,
  ): Promise<PaginatedResult<DataTable>> {
    const { page = 1, limit = 10, offset = 0 } = options || {}
    const skip = offset || (page - 1) * limit

    const [items, total] = await this.dataTableRepository.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
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

  async findByUserId(
    userId: string,
    options?: PaginationOptions,
  ): Promise<PaginatedResult<DataTable>> {
    const { page = 1, limit = 10, offset = 0 } = options || {}
    const skip = offset || (page - 1) * limit

    const [items, total] = await this.dataTableRepository.findAndCount({
      where: { userId },
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
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

  async findOne(id: string) {
    return await this.dataTableRepository.findOne({ where: { id } })
  }

  async update(
    id: string,
    name: string,
    columns: { id: string; name: string; type: string }[],
    userId?: string,
  ) {
    const updateData: Partial<DataTable> = { name, columns }
    if (userId !== undefined) {
      updateData.userId = userId
    }

    await this.dataTableRepository.update(id, updateData)
    return await this.findOne(id)
  }

  async remove(id: string) {
    return await this.dataTableRepository.delete(id)
  }
}
