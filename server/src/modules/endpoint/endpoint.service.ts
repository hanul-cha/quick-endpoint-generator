import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOptionsWhere, Repository } from 'typeorm'
import { Endpoint } from './endpoint.entity'
import { CreateEndpointDto } from './dto/create-endpoint.dto'
import { UpdateEndpointDto } from './dto/update-endpoint.dto'
import {
  paginate,
  PaginatedResult,
  PaginationOptions,
} from 'src/util/pagination'

@Injectable()
export class EndpointService {
  constructor(
    @InjectRepository(Endpoint)
    private endpointRepository: Repository<Endpoint>,
  ) {}

  async create(createEndpointDto: CreateEndpointDto, userId: number) {
    const endpoint = this.endpointRepository.create({
      ...createEndpointDto,
      userId,
      parameter: createEndpointDto.parameter || {},
    })
    return await this.endpointRepository.save(endpoint)
  }

  async findAll(where?: FindOptionsWhere<Endpoint>) {
    return await this.endpointRepository.find({
      where,
      order: { createdAt: 'DESC' },
    })
  }

  async paginate(
    where?: FindOptionsWhere<Endpoint>,
    options?: PaginationOptions,
  ): Promise<PaginatedResult<Endpoint>> {
    return await paginate(this.endpointRepository, where, options)
  }

  async findOne(id: string) {
    const endpoint = await this.endpointRepository.findOne({ where: { id } })
    if (!endpoint) {
      throw new NotFoundException(`Endpoint with ID "${id}" not found`)
    }
    return endpoint
  }

  async update(
    id: string,
    updateEndpointDto: UpdateEndpointDto,
    userId: number,
  ) {
    const endpoint = await this.findOne(id)
    if (endpoint.userId !== userId) {
      throw new NotFoundException(`Endpoint with ID "${id}" not found`)
    }

    const updateData = {
      ...updateEndpointDto,
      userId,
      parameter: updateEndpointDto.parameter || {},
    }
    await this.endpointRepository.update(id, updateData)
    return await this.findOne(id)
  }

  async remove(id: string, userId: number) {
    const endpoint = await this.findOne(id)
    if (endpoint.userId !== userId) {
      throw new NotFoundException(`Endpoint with ID "${id}" not found`)
    }

    return await this.endpointRepository.delete(id)
  }
}
