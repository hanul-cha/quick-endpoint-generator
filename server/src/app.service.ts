import * as vm from 'vm'

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'

import { DataTableService } from './modules/data-table/data-table.service'
import { EndpointService } from './modules/endpoint/endpoint.service'
import { GlobalPrimitive } from './app.types'

export interface EndpointContext {
  userId: number
}

export interface EndpointRunOptions {
  body?: Record<string, string>
  query?: Record<string, string>
  context: EndpointContext
}

@Injectable()
export class AppService {
  constructor(
    private readonly endpointService: EndpointService,
    private readonly dataTableService: DataTableService,
  ) {}

  async runEndpoint(endpointId: string, options: EndpointRunOptions) {
    const { body, query, context } = options
    const mergedParams = { ...body, ...query }

    const endpoint = await this.endpointService.findOne(endpointId)
    console.log(endpoint)

    this.validateParameter(endpoint.parameter, mergedParams)

    // script 실행
    if (endpoint.script) {
      return this.executeScript(endpoint.script, mergedParams, context)
    }

    return 'No script provided'
  }

  /**
   * 스크립트를 안전하게 실행하는 메서드
   * @param script 실행할 스크립트 코드
   * @param params 스크립트에 전달할 파라미터
   * @param context 실행 컨텍스트 (사용자 정보 등)
   * @returns 스크립트 실행 결과
   */
  private async executeScript(
    script: string,
    params: Record<string, any>,
    context: EndpointContext,
  ): Promise<any> {
    try {
      // 제한된 리포지토리 객체 생성
      const limitedRepository = this.createLimitedRepository(context)

      const scriptContext = this.createScriptContext(params, limitedRepository)
      const scriptObj = this.createScriptObject(script)
      return await this.runScriptWithTimeout(scriptObj, scriptContext)
    } catch (error) {
      console.error('Script execution error:', error)
      throw new HttpException(
        `Script execution failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  /**
   * 스크립트에서 사용할 수 있는 제한된 리포지토리 객체 생성
   * @param context 실행 컨텍스트 (사용자 정보 등)
   * @returns 제한된 리포지토리 객체
   */
  private createLimitedRepository(context: EndpointContext) {
    return {
      // 테이블 관련 제한된 CRUD 작업
      table: {
        findOne: async (id: string) => {
          // userId로 접근 제한
          const table = await this.dataTableService.findOne(id)
          if (table?.userId !== context.userId) {
            throw new HttpException(
              'Access denied to this table',
              HttpStatus.FORBIDDEN,
            )
          }
          return table
        },
        findAll: async (options?: any) => {
          // userId로 필터링
          return this.dataTableService.findByUserId(context.userId, options)
        },
        find: async (where?: any, options?: any) => {
          // userId로 필터링
          return this.dataTableService.find(
            { ...where, userId: context.userId },
            options,
          )
        },
        // 추가 제한된 메서드들...
      },
      // 다른 리포지토리들도 필요에 따라 추가 가능
    }
  }

  /**
   * 스크립트 실행을 위한 격리된 컨텍스트 생성
   * @param params 스크립트에 전달할 파라미터
   * @param repository 제한된 리포지토리 객체
   * @returns 격리된 컨텍스트
   */
  private createScriptContext(
    params: Record<string, any>,
    repository: any,
  ): vm.Context {
    return vm.createContext({
      params: params,
      repository: repository, // 제한된 리포지토리 객체 전달
      console: {
        log: (...args) => console.log('[Script]', ...args),
        error: (...args) => console.error('[Script]', ...args),
        warn: (...args) => console.warn('[Script]', ...args),
      },
      // 필요한 유틸리티 함수만 노출
      JSON: JSON,
      Date: Date,
      Math: Math,
      // 추가 보안을 위해 setTimeout, setInterval 등은 제외
    })
  }

  /**
   * 스크립트 객체 생성
   * @param script 실행할 스크립트 코드
   * @returns VM 스크립트 객체
   */
  private createScriptObject(script: string): vm.Script {
    return new vm.Script(`
      (function(params, repository) {
        ${script}
      })(params, repository);
    `)
  }

  /**
   * 타임아웃이 있는 스크립트 실행
   * @param script VM 스크립트 객체
   * @param context 스크립트 실행 컨텍스트
   * @returns 스크립트 실행 결과
   */
  private async runScriptWithTimeout(
    script: vm.Script,
    context: vm.Context,
  ): Promise<any> {
    const timeout = 5000
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Script execution timed out'))
      }, timeout)

      try {
        script.runInContext(context, { timeout })
        clearTimeout(timeoutId)
        resolve(context.result)
      } catch (error) {
        clearTimeout(timeoutId)
        reject(error)
      }
    })
  }

  /**
   * 파라미터 유효성 검사
   * @param parameter 정의된 파라미터 타입
   * @param mergedParams 실제 전달된 파라미터
   */
  private validateParameter(
    parameter: Record<string, GlobalPrimitive>,
    mergedParams: Record<string, string>,
  ) {
    this.validateParameterCount(parameter, mergedParams)
    this.validateParameterTypes(parameter, mergedParams)
  }

  /**
   * 파라미터 개수 검증
   * @param parameter 정의된 파라미터 타입
   * @param mergedParams 실제 전달된 파라미터
   */
  private validateParameterCount(
    parameter: Record<string, GlobalPrimitive>,
    mergedParams: Record<string, string>,
  ) {
    const parameterKeys = Object.keys(parameter)
    const mergedParamsKeys = Object.keys(mergedParams)

    if (parameterKeys.length !== mergedParamsKeys.length) {
      throw new Error('Parameter keys and merged params keys length mismatch')
    }
  }

  /**
   * 파라미터 타입 검증
   * @param parameter 정의된 파라미터 타입
   * @param mergedParams 실제 전달된 파라미터
   */
  private validateParameterTypes(
    parameter: Record<string, GlobalPrimitive>,
    mergedParams: Record<string, string>,
  ) {
    for (const key of Object.keys(parameter)) {
      this.validateSingleParameterType(parameter[key], mergedParams[key])
    }
  }

  /**
   * 단일 파라미터 타입 검증
   * @param expectedType 예상 타입
   * @param actualValue 실제 값
   */
  private validateSingleParameterType(
    expectedType: GlobalPrimitive,
    actualValue: any,
  ) {
    if (
      expectedType === GlobalPrimitive.String &&
      typeof actualValue !== 'string'
    ) {
      throw new HttpException('Parameter type mismatch', HttpStatus.BAD_REQUEST)
    } else if (
      expectedType === GlobalPrimitive.Number &&
      typeof actualValue !== 'number'
    ) {
      throw new HttpException('Parameter type mismatch', HttpStatus.BAD_REQUEST)
    } else if (
      expectedType === GlobalPrimitive.Boolean &&
      typeof actualValue !== 'boolean'
    ) {
      throw new HttpException('Parameter type mismatch', HttpStatus.BAD_REQUEST)
    } else if (
      expectedType === GlobalPrimitive.Array &&
      !Array.isArray(actualValue)
    ) {
      throw new HttpException('Parameter type mismatch', HttpStatus.BAD_REQUEST)
    } else if (
      expectedType === GlobalPrimitive.Object &&
      typeof actualValue !== 'object'
    ) {
      throw new HttpException('Parameter type mismatch', HttpStatus.BAD_REQUEST)
    }
  }
}
