import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, FindOptionsWhere } from 'typeorm'
import { DataColumn, DataTable } from './data-table.entity'
import {
  paginate,
  PaginatedResult,
  PaginationOptions,
} from 'src/util/pagination'

@Injectable()
export class DataTableService {
  constructor(
    @InjectRepository(DataTable)
    private readonly dataTableRepository: Repository<DataTable>,
  ) {}

  private validateColumnIds(columns: DataColumn[]) {
    const columnIds = columns.map((column) => column.id)
    const uniqueColumnIds = new Set(columnIds)
    if (columnIds.length !== uniqueColumnIds.size) {
      throw new Error('Column IDs must be unique')
    }

    columnIds.forEach((id) => {
      if (isNaN(Number(id))) {
        throw new Error('Column IDs must be numbers')
      }
    })
  }

  async create(name: string, columns?: DataColumn[], userId?: number) {
    this.validateColumnIds(columns)

    const dataTable = this.dataTableRepository.create({
      name,
      columns,
      userId,
    })
    return await this.dataTableRepository.save(dataTable)
  }

  async paginate(
    where?: FindOptionsWhere<DataTable>,
    options?: PaginationOptions,
  ): Promise<PaginatedResult<DataTable>> {
    return await paginate(this.dataTableRepository, where, options)
  }

  async findAll(where?: FindOptionsWhere<DataTable>): Promise<DataTable[]> {
    return await this.dataTableRepository.find({
      where,
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

  async update(
    id: string,
    name: string,
    columns?: DataColumn[],
    userId?: number,
  ) {
    this.validateColumnIds(columns)

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
