import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DataRow } from './data-row.entity'
import { DataTableService } from '../data-table/data-table.service'

@Injectable()
export class DataRowService {
  constructor(
    @InjectRepository(DataRow)
    private dataRowRepository: Repository<DataRow>,
    private dataTableService: DataTableService,
  ) {}

  async create(
    dataTableId: string,
    values: { columnId: string; value: any }[],
  ) {
    // 데이터 테이블이 존재하는지 확인
    const dataTable = await this.dataTableService.findOne(dataTableId)
    if (!dataTable) {
      throw new Error('DataTable not found')
    }

    // 컬럼 ID가 모두 존재하는지 확인
    const columnIds = dataTable.columns.map((col) => col.id)
    const valueColumnIds = values.map((val) => val.columnId)
    const invalidColumnIds = valueColumnIds.filter(
      (id) => !columnIds.includes(id),
    )
    if (invalidColumnIds.length > 0) {
      throw new Error(`Invalid column IDs: ${invalidColumnIds.join(', ')}`)
    }

    const dataRow = this.dataRowRepository.create({
      dataTableId,
      values,
    })
    return await this.dataRowRepository.save(dataRow)
  }

  async findAll(dataTableId: string) {
    return await this.dataRowRepository.find({
      where: { dataTableId },
    })
  }

  async findOne(id: string) {
    return await this.dataRowRepository.findOne({ where: { id } })
  }

  async update(id: string, values: { columnId: string; value: any }[]) {
    const dataRow = await this.findOne(id)
    if (!dataRow) {
      throw new Error('DataRow not found')
    }

    // 데이터 테이블의 컬럼 ID가 모두 존재하는지 확인
    const dataTable = await this.dataTableService.findOne(dataRow.dataTableId)
    const columnIds = dataTable.columns.map((col) => col.id)
    const valueColumnIds = values.map((val) => val.columnId)
    const invalidColumnIds = valueColumnIds.filter(
      (id) => !columnIds.includes(id),
    )
    if (invalidColumnIds.length > 0) {
      throw new Error(`Invalid column IDs: ${invalidColumnIds.join(', ')}`)
    }

    await this.dataRowRepository.update(id, { values })
    return await this.findOne(id)
  }

  async remove(id: string) {
    return await this.dataRowRepository.delete(id)
  }
}
