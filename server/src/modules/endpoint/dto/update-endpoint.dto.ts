import { CreateEndpointDto } from './create-endpoint.dto'
import { PartialType } from '@nestjs/mapped-types'

export class UpdateEndpointDto extends PartialType(CreateEndpointDto) {}
