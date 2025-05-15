import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, FindOptionsWhere } from 'typeorm'
import { DataColumn, DataTable } from './data-table.entity'

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
    private readonly dataTableRepository: Repository<DataTable>,
  ) {}

  async create(name: string, columns?: DataColumn[], userId?: number) {
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
    userId: number,
    where?: FindOptionsWhere<DataTable>,
  ): Promise<DataTable[]> {
    return await this.dataTableRepository.find({
      where: {
        userId,
        ...where,
      },
      order: { createdAt: 'DESC' },
    })
  }

  async findTableIdsByUserId(userId: number) {
    const tables = await this.dataTableRepository.find({ where: { userId } })
    return tables.map((table) => table.id)
  }

  async findOne(id: string) {
    return await this.dataTableRepository.findOne({ where: { id } })
  }

  /**
   * 다양한 조건으로 테이블을 검색하는 메서드
   * @param where 검색 조건
   * @param options 페이지네이션 옵션
   * @returns 페이지네이션된 결과
   */
  async find(
    where?: FindOptionsWhere<DataTable>,
    options?: PaginationOptions,
  ): Promise<PaginatedResult<DataTable>> {
    const { page = 1, limit = 10, offset = 0 } = options || {}
    const skip = offset || (page - 1) * limit

    const [items, total] = await this.dataTableRepository.findAndCount({
      where,
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

  async update(
    id: string,
    name: string,
    columns?: DataColumn[],
    userId?: number,
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
