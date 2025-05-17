import * as vm from 'vm'

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'

import { DataRowService } from './modules/data-row/data-row.service'
import { DataTableService } from './modules/data-table/data-table.service'
import { EndpointParameter } from './modules/endpoint/endpoint.entity'
import { EndpointService } from './modules/endpoint/endpoint.service'
import { GlobalPrimitive } from './app.types'
import { Raw } from 'typeorm'
import { createLimitedRepository } from './app.limited.repository'

export interface EndpointRunOptions {
  body?: Record<string, string>
  query?: Record<string, string>
}

@Injectable()
export class AppService {
  constructor(
    private readonly endpointService: EndpointService,
    readonly dataTableService: DataTableService,
    readonly dataRowService: DataRowService,
  ) {}

  async runEndpoint(endpointId: string, options: EndpointRunOptions) {
    const { body, query } = options
    const mergedParams = { ...body, ...query }

    const endpoint = await this.endpointService.findOne(endpointId)

    // script 실행
    if (endpoint.script) {
      try {
        this.validateParameter(endpoint.parameter, mergedParams)

        const data = await this.executeScript(
          endpoint.script,
          mergedParams,
          endpoint.userId,
        )

        return {
          status: 'success',
          data,
        }
      } catch (error) {
        return {
          status: 'fail',
          data: { message: error.message },
        }
      }
    }

    return {
      status: 'fail',
      data: {
        message: 'No script provided',
      },
    }
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
    userId: number,
  ): Promise<any> {
    try {
      // 제한된 리포지토리 객체 생성
      const limitedRepository = createLimitedRepository(userId, this)

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
      Number: Number,
      String: String,
      Boolean: Boolean,
      Object: Object,
      Array: Array,
      Raw: Raw,
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
      ${script}
      result = main(params, repository);
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
    parameter: Record<string, EndpointParameter>,
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
    parameter: Record<string, EndpointParameter>,
    mergedParams: Record<string, string>,
  ) {
    const parameterKeys = Object.keys(parameter)
    const mergedParamsKeys = Object.keys(mergedParams)

    // required가 true인 파라미터가 모두 있는지 확인
    const requiredParams = parameterKeys.filter(
      (key) => parameter[key].required,
    )
    const missingRequired = requiredParams.filter(
      (key) =>
        !mergedParamsKeys.includes(key) ||
        mergedParams[key] === '' ||
        mergedParams[key] === undefined ||
        mergedParams[key] === null,
    )

    if (missingRequired.length > 0) {
      throw new Error(
        `Missing required parameters: ${missingRequired.join(', ')}`,
      )
    }
  }

  /**
   * 파라미터 값을 정의된 타입에 맞게 변환
   * @param value 변환할 값
   * @param type 변환할 타입
   * @returns 변환된 값
   */
  private convertParameterValue(value: string, type: GlobalPrimitive): any {
    try {
      switch (type) {
        case GlobalPrimitive.String:
          return value
        case GlobalPrimitive.Number:
          const num = Number(value)
          if (isNaN(num)) {
            throw new Error('Parameter type mismatch')
          }
          return num
        case GlobalPrimitive.Boolean:
          if (value.toLowerCase() === 'true') return true
          if (value.toLowerCase() === 'false') return false
          throw new Error('Parameter type mismatch')
        case GlobalPrimitive.Object:
          try {
            return JSON.parse(value)
          } catch {
            throw new Error('Parameter type mismatch')
          }
        case GlobalPrimitive.Array:
          try {
            const parsed = JSON.parse(value)
            if (!Array.isArray(parsed)) {
              throw new Error('Parameter type mismatch')
            }
            return parsed
          } catch {
            throw new Error('Parameter type mismatch')
          }
        default:
          throw new Error('Parameter type mismatch')
      }
    } catch (error) {
      throw new HttpException('Parameter type mismatch', HttpStatus.BAD_REQUEST)
    }
  }

  /**
   * 파라미터 타입 검증
   * @param parameter 정의된 파라미터 타입
   * @param mergedParams 실제 전달된 파라미터
   */
  private validateParameterTypes(
    parameter: Record<string, EndpointParameter>,
    mergedParams: Record<string, string>,
  ) {
    for (const key of Object.keys(parameter)) {
      if (!mergedParams[key] && !parameter[key].required) {
        continue
      }

      try {
        mergedParams[key] = this.convertParameterValue(
          mergedParams[key],
          parameter[key].type,
        )
      } catch (error) {
        throw new HttpException(
          `Parameter type mismatch for ${key}`,
          HttpStatus.BAD_REQUEST,
        )
      }
    }
  }
}
