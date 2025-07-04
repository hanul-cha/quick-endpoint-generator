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

  private setColumnIds(columns?: DataColumn[]) {
    columns?.forEach((column, index) => {
      column.id = `${index + 1}`
    })
  }

  async create(name: string, columns?: DataColumn[], userId?: number) {
    this.setColumnIds(columns)

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
    this.setColumnIds(columns)

    const updateData: Partial<DataTable> = { name, columns }
    if (userId !== undefined) {
      updateData.userId = userId
    }

    await this.dataTableRepository.update(id, updateData)
    return await this.findOne(id)
  }

  async remove(userId: number, where?: FindOptionsWhere<DataTable>) {
    return await this.dataTableRepository.delete({
      ...where,
      userId,
    })
  }
}
