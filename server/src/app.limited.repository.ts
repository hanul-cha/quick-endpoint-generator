import { HttpException, HttpStatus } from '@nestjs/common'

import { AppService } from './app.service'
import { DataTable } from './modules/data-table/data-table.entity'
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
        const table = await appService.dataTableService.findOne(id)
        if (table?.userId !== userId) {
          throw new HttpException(
            'Access denied to this table',
            HttpStatus.FORBIDDEN,
          )
        }
        return table
      },
      findAll: async (where?: any) => {
        // userId로 필터링
        return appService.dataTableService.findAll({
          ...where,
          userId,
        })
      },
      find: async (where?: any, options?: any) => {
        // userId로 필터링
        return appService.dataTableService.paginate(
          { ...where, userId: userId },
          options,
        )
      },
      create: async (data: any) => {
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
      update: async (id: string, data: any) => {
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
      delete: async (id: string) => {
        // 먼저 테이블이 존재하고 권한이 있는지 확인
        const table = await appService.dataTableService.findOne(id)
        if (!table || table.userId !== userId) {
          throw new HttpException(
            'Access denied to this table',
            HttpStatus.FORBIDDEN,
          )
        }
        return appService.dataTableService.remove(id)
      },
      // 추가 제한된 메서드들...
    },
    row: {
      findAll: async (options?: any) => {
        return appService.dataRowService.findAllByUserId(userId, options)
      },
      find: async (options?: any) => {
        return appService.dataRowService.paginateByUserId(userId, options)
      },
    },
  }
}
