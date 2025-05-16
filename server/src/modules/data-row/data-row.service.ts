import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOptionsWhere, In, Repository } from 'typeorm'
import { DataRow } from './data-row.entity'
import { DataTableService } from '../data-table/data-table.service'
import {
  paginate,
  PaginatedResult,
  PaginationOptions,
} from 'src/util/pagination'
import { DataTable } from '../data-table/data-table.entity'

@Injectable()
export class DataRowService {
  constructor(
    @InjectRepository(DataRow)
    private dataRowRepository: Repository<DataRow>,
    private dataTableService: DataTableService,
  ) {}

  async create(dataTableId: string, values?: Record<string, any>) {
    // 데이터 테이블이 존재하는지 확인
    const dataTable = await this.dataTableService.findOne(dataTableId)
    if (!dataTable) {
      throw new Error('DataTable not found')
    }

    // 컬럼 ID가 모두 존재하는지 확인
    await this.validateColumnIds(dataTable, values)

    const dataRow = this.dataRowRepository.create({
      dataTableId,
      values,
    })
    return await this.dataRowRepository.save(dataRow)
  }

  async findAllByDataTableId(
    dataTableId: string,
    where?: FindOptionsWhere<DataRow>,
  ): Promise<DataRow[]> {
    return await this.dataRowRepository.find({
      where: {
        dataTableId,
        ...where,
      },
      order: { createdAt: 'DESC' },
    })
  }

  async findAll(where?: FindOptionsWhere<DataRow>): Promise<DataRow[]> {
    return await this.dataRowRepository.find({
      where,
      order: { createdAt: 'DESC' },
    })
  }

  async findAllByUserId(
    userId: number,
    where?: Partial<DataRow>,
  ): Promise<DataRow[]> {
    const tableIds = await this.dataTableService.findTableIdsByUserId(userId)

    return await this.dataRowRepository.find({
      where: {
        dataTableId: In(tableIds),
        ...where,
      },
      order: { createdAt: 'DESC' },
    })
  }

  async paginate(
    where?: FindOptionsWhere<DataRow>,
    options?: PaginationOptions,
  ): Promise<PaginatedResult<DataRow>> {
    return await paginate(this.dataRowRepository, where, options)
  }

  async paginateByDataTableId(
    dataTableId: string,
    where?: FindOptionsWhere<DataRow>,
    options?: PaginationOptions,
  ): Promise<PaginatedResult<DataRow>> {
    const dataTable = await this.dataTableService.findOne(dataTableId)
    if (!dataTable) {
      throw new Error('DataTable not found')
    }

    return await this.paginate(
      {
        dataTableId,
        ...where,
      },
      options,
    )
  }

  async paginateByUserId(
    userId: number,
    where?: FindOptionsWhere<DataRow>,
    options?: PaginationOptions,
  ): Promise<PaginatedResult<DataRow>> {
    const tableIds = await this.dataTableService.findTableIdsByUserId(userId)
    return await this.paginate(
      {
        dataTableId: In(tableIds),
        ...where,
      },
      options,
    )
  }

  async findOne(id: string) {
    return await this.dataRowRepository.findOne({ where: { id } })
  }

  async update(id: string, values?: Record<string, any>) {
    const dataRow = await this.findOne(id)
    if (!dataRow) {
      throw new Error('DataRow not found')
    }

    const dataTable = await this.dataTableService.findOne(dataRow.dataTableId)

    if (!dataTable) {
      throw new Error('DataTable not found')
    }

    // 데이터 테이블의 컬럼 ID가 모두 존재하는지 확인
    await this.validateColumnIds(dataTable, values)

    await this.dataRowRepository.update(id, { values })
    return await this.findOne(id)
  }

  async remove(id: string) {
    return await this.dataRowRepository.delete(id)
  }

  private async validateColumnIds(
    dataTable: DataTable,
    values?: Record<string, any>,
  ) {
    const columnIds = dataTable.columns?.map((col) => col.id) || []
    const valueColumnIds = Object.keys(values || {})
    const invalidColumnIds = valueColumnIds.filter(
      (id) => !columnIds.includes(id),
    )
    if (invalidColumnIds.length > 0) {
      throw new Error(`Invalid column IDs: ${invalidColumnIds.join(', ')}`)
    }
  }
}
