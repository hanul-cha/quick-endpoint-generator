import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator'

import { EndpointParameter } from '../endpoint.entity'

export class CreateEndpointDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsOptional()
  script?: string

  @IsObject()
  @IsOptional()
  parameter?: Record<string, EndpointParameter>
}
