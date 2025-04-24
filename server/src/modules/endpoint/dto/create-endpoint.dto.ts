import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator'

export class CreateEndpointDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsOptional()
  script?: string

  @IsEnum(['body', 'query'])
  @IsNotEmpty()
  parameterType: 'body' | 'query'

  @IsObject()
  @IsOptional()
  parameter?: object
}
