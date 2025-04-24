import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator'

import { GlobalPrimitive } from 'src/app.types'

export class CreateEndpointDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsOptional()
  script?: string

  @IsObject()
  @IsOptional()
  parameter?: Record<string, GlobalPrimitive>
}
