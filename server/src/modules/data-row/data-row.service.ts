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
import { GlobalPrimitive } from 'src/app.types'
import { deleteEmptyStringObject } from 'src/util/emptyObject'

@Injectable()
export class DataRowService {
  constructor(
    @InjectRepository(DataRow)
    readonly dataRowRepository: Repository<DataRow>,
    readonly dataTableService: DataTableService,
  ) {}

  async create(dataTableId: string, _values?: Record<string, any>) {
    const values = deleteEmptyStringObject(_values)

    const dataTable = await this.dataTableService.findOne(dataTableId)
    if (!dataTable) {
      throw new Error('DataTable not found')
    }

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

  async updateById(id: string, _values?: Record<string, any>) {
    const values = deleteEmptyStringObject(_values)

    const dataRow = await this.findOne(id)
    if (!dataRow) {
      throw new Error('DataRow not found')
    }

    const dataTable = await this.dataTableService.findOne(dataRow.dataTableId)

    if (!dataTable) {
      throw new Error('DataTable not found')
    }

    await this.validateColumnIds(dataTable, values)

    await this.dataRowRepository.update(id, { values })
    return await this.findOne(id)
  }

  async updateByWhere(
    userId: number,
    where?: object,
    _values?: Record<string, any>,
  ) {
    const values = deleteEmptyStringObject(_values)

    const dataTableIds =
      await this.dataTableService.findTableIdsByUserId(userId)

    return await this.dataRowRepository.update(
      {
        dataTableId: In(dataTableIds),
        ...where,
      },
      { values },
    )
  }

  async updateByEntities(
    userId: number,
    rowValues: (Record<string, any> & { id: string })[],
  ) {
    const dataTableIds =
      await this.dataTableService.findTableIdsByUserId(userId)

    const dataRows = await this.dataRowRepository.find({
      where: {
        dataTableId: In(dataTableIds),
        id: In(rowValues.map((row) => row.id)),
      },
    })

    const rowsToUpdate = dataRows.map((row) => ({
      ...row,
      values: rowValues.find((rowValue) => rowValue.id === row.id)?.values,
    }))

    return await this.dataRowRepository.save(rowsToUpdate)
  }

  async remove(userId: number, where?: object) {
    const dataTableIds =
      await this.dataTableService.findTableIdsByUserId(userId)

    return await this.dataRowRepository.delete({
      dataTableId: In(dataTableIds),
      ...where,
    })
  }

  private async validateColumnIds(
    dataTable: DataTable,
    values?: Record<string, any>,
  ) {
    // 데이터 테이블의 모든 컬럼 ID 추출
    const columnIds = dataTable.columns?.map((col) => col.id) || []
    // values에 제공된 모든 컬럼 ID 추출
    const valueColumnIds = Object.keys(values || {})

    // 1. 유효하지 않은 컬럼 ID 확인 (values에는 있지만 테이블에는 없는 컬럼)
    const invalidColumnIds = valueColumnIds.filter(
      (id) => !columnIds.includes(id),
    )
    if (invalidColumnIds.length > 0) {
      throw new Error(`Invalid column IDs: ${invalidColumnIds.join(', ')}`)
    }

    // 2. 필수(required) 컬럼이 모두 존재하는지 확인
    const requiredColumns =
      dataTable.columns?.filter((col) => col.required === true) || []
    const requiredColumnIds = requiredColumns.map((col) => col.id)
    const missingRequiredColumnIds = requiredColumnIds.filter(
      (id) =>
        !valueColumnIds.includes(id) ||
        values[id] === undefined ||
        values[id] === null ||
        values[id] === '',
    )

    if (missingRequiredColumnIds.length > 0) {
      throw new Error(
        `Missing required columns: ${missingRequiredColumnIds.join(', ')}`,
      )
    }

    // 3. 타입 유효성 검사
    const columnsMap = new Map(
      dataTable.columns?.map((col) => [col.id, col]) || [],
    )
    const typeErrors: string[] = []

    for (const columnId of valueColumnIds) {
      const column = columnsMap.get(columnId)
      if (
        column &&
        values[columnId] !== undefined &&
        values[columnId] !== null
      ) {
        const value = values[columnId]
        const isValid = this.validateColumnType(column.type, value)

        if (!isValid) {
          typeErrors.push(
            `Column '${column.name}'(${columnId}) has invalid type. Expected: ${column.type}, Actual: ${typeof value}`,
          )
        }
      }
    }

    if (typeErrors.length > 0) {
      throw new Error(typeErrors.join('\n'))
    }
  }

  private validateColumnType(
    type: GlobalPrimitive | string,
    value: any,
  ): boolean {
    // 타입 문자열 변환 (대소문자 통일을 위해)
    const normalizedType =
      typeof type === 'string' ? type.toLowerCase() : String(type).toLowerCase()

    switch (normalizedType) {
      case GlobalPrimitive.String.toLowerCase():
        return typeof value === 'string'

      case GlobalPrimitive.Number.toLowerCase():
        return typeof value === 'number' && !isNaN(value)

      case GlobalPrimitive.Boolean.toLowerCase():
        return typeof value === 'boolean'

      case GlobalPrimitive.Array.toLowerCase():
        return Array.isArray(value)

      case GlobalPrimitive.Object.toLowerCase():
      case 'json': // json 타입은 Object와 동일하게 처리
        return (
          typeof value === 'object' && value !== null && !Array.isArray(value)
        )

      case 'date': // 날짜 타입 처리
        if (value instanceof Date) {
          return !isNaN(value.getTime()) // 유효한 날짜인지 확인
        }

        if (typeof value === 'string') {
          // 문자열을 Date로 변환 시도
          const date = new Date(value)
          return !isNaN(date.getTime())
        }

        return false

      default:
        return false
    }
  }
}
