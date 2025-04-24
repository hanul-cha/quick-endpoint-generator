import { HttpException, HttpStatus, Injectable } from '@nestjs/common'

import { EndpointService } from './modules/endpoint/endpoint.service'
import { GlobalPrimitive } from './app.types'

@Injectable()
export class AppService {
  constructor(private readonly endpointService: EndpointService) {}

  async runEndpoint(
    endpointId: string,
    {
      body,
      query,
    }: {
      body?: Record<string, string>
      query?: Record<string, string>
    },
  ) {
    const mergedParams = { ...body, ...query }

    const endpoint = await this.endpointService.findOne(endpointId)
    console.log(endpoint)

    this.validateParameter(endpoint.parameter, mergedParams)

    return 'test'
  }

  private validateParameter(
    parameter: Record<string, GlobalPrimitive>,
    mergedParams: Record<string, string>,
  ) {
    const parameterKeys = Object.keys(parameter)
    const mergedParamsKeys = Object.keys(mergedParams)

    if (parameterKeys.length !== mergedParamsKeys.length) {
      throw new Error('Parameter keys and merged params keys length mismatch')
    }

    for (const key of parameterKeys) {
      if (parameter[key] === GlobalPrimitive.String) {
        if (typeof mergedParams[key] !== 'string') {
          throw new HttpException(
            'Parameter type mismatch',
            HttpStatus.BAD_REQUEST,
          )
        }
      } else if (parameter[key] === GlobalPrimitive.Number) {
        if (typeof mergedParams[key] !== 'number') {
          throw new HttpException(
            'Parameter type mismatch',
            HttpStatus.BAD_REQUEST,
          )
        }
      } else if (parameter[key] === GlobalPrimitive.Boolean) {
        if (typeof mergedParams[key] !== 'boolean') {
          throw new HttpException(
            'Parameter type mismatch',
            HttpStatus.BAD_REQUEST,
          )
        }
      } else if (parameter[key] === GlobalPrimitive.Array) {
        if (!Array.isArray(mergedParams[key])) {
          throw new HttpException(
            'Parameter type mismatch',
            HttpStatus.BAD_REQUEST,
          )
        }
      } else if (parameter[key] === GlobalPrimitive.Object) {
        if (typeof mergedParams[key] !== 'object') {
          throw new HttpException(
            'Parameter type mismatch',
            HttpStatus.BAD_REQUEST,
          )
        }
      }
    }
  }
}
