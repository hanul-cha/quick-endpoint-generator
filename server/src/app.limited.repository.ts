import { HttpException, HttpStatus } from '@nestjs/common'

import { AppService } from './app.service'
import { DataRow } from './modules/data-row/data-row.entity'
import { DataTable } from './modules/data-table/data-table.entity'
import { PaginationOptions } from './util/pagination'
import { validate } from 'class-validator'

/**
 * 스크립트에서 사용할 수 있는 제한된 리포지토리 객체 생성
 * @param context 실행 컨텍스트 (사용자 정보 등)
 * @returns 제한된 리포지토리 객체
 */
export function createLimitedRepository(
  userId: number,
  appService: AppService,
) {
  return {
    table: {
      findOne: async (id: string) => {
        // userId로 접근 제한
        if (!id) {
          throw new HttpException('id is required', HttpStatus.BAD_REQUEST)
        }
        const table = await appService.dataTableService.findOne(id)
        if (table?.userId !== userId) {
          throw new HttpException(
            'Access denied to this table',
            HttpStatus.FORBIDDEN,
          )
        }
        return table
      },
      findAll: async (where?: object) => {
        // userId로 필터링
        return appService.dataTableService.findAll({
          ...where,
          userId,
        })
      },
      find: async (where?: object, options?: PaginationOptions) => {
        // userId로 필터링
        return appService.dataTableService.paginate(
          { ...where, userId: userId },
          options,
        )
      },
      create: async (data: object) => {
        // DataTable 인스턴스 생성
        const table = new DataTable()
        Object.assign(table, {
          ...data,
          userId,
        })

        // 유효성 검사
        const errors = await validate(table)
        if (errors.length > 0) {
          throw new HttpException(
            {
              message: 'Validation failed',
              errors: errors.map((error) => ({
                property: error.property,
                constraints: error.constraints,
              })),
            },
            HttpStatus.BAD_REQUEST,
          )
        }

        return appService.dataTableService.create(
          table.name,
          table.columns,
          userId,
        )
      },
      update: async (id: string, data: object) => {
        // 먼저 테이블이 존재하고 권한이 있는지 확인
        const existingTable = await appService.dataTableService.findOne(id)
        if (!existingTable || existingTable.userId !== userId) {
          throw new HttpException(
            'Access denied to this table',
            HttpStatus.FORBIDDEN,
          )
        }

        // DataTable 인스턴스 생성
        const table = new DataTable()
        Object.assign(table, {
          ...existingTable,
          ...data,
          userId: existingTable.userId, // userId는 변경 불가
        })

        // 유효성 검사
        const errors = await validate(table)
        if (errors.length > 0) {
          throw new HttpException(
            {
              message: 'Validation failed',
              errors: errors.map((error) => ({
                property: error.property,
                constraints: error.constraints,
              })),
            },
            HttpStatus.BAD_REQUEST,
          )
        }

        const { name, columns } = table
        return appService.dataTableService.update(id, name, columns, userId)
      },
      delete: async (where?: object) => {
        return appService.dataTableService.remove(userId, where)
      },
    },
    row: {
      findOne: async (id?: string) => {
        if (!id) {
          throw new HttpException('id is required', HttpStatus.BAD_REQUEST)
        }
        const row = await appService.dataRowService.findOne(id)

        const dataTable = await appService.dataTableService.findOne(
          row.dataTableId,
        )
        if (!dataTable || dataTable.userId !== userId) {
          throw new HttpException(
            'Access denied to this table',
            HttpStatus.FORBIDDEN,
          )
        }
        return row
      },
      findAll: async (where?: object) => {
        return appService.dataRowService.findAllByUserId(userId, where)
      },
      find: async (where?: object, options?: PaginationOptions) => {
        return appService.dataRowService.paginateByUserId(
          userId,
          where,
          options,
        )
      },
      create: async (data: {
        dataTableId?: string
        values?: Record<string, any>
      }) => {
        if (!data.dataTableId) {
          throw new HttpException(
            'dataTableId is required',
            HttpStatus.BAD_REQUEST,
          )
        }

        try {
          return appService.dataRowService.create(data.dataTableId, data.values)
        } catch (error) {
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
        }
      },
      update: async (id?: string, data?: object) => {
        if (!id) {
          throw new HttpException('id is required', HttpStatus.BAD_REQUEST)
        }
        return appService.dataRowService.updateById(id, data)
      },
      updateByWhere: async (where?: object, value?: Record<string, any>) => {
        return appService.dataRowService.updateByWhere(userId, where, value)
      },
      updateByEntities: async (rows: DataRow[]) => {
        return appService.dataRowService.updateByEntities(userId, rows)
      },
      delete: async (where?: object) => {
        return appService.dataRowService.remove(userId, where)
      },
    },
  }
}
