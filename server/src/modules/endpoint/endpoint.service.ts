import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Endpoint } from './endpoint.entity'
import { CreateEndpointDto } from './dto/create-endpoint.dto'
import { UpdateEndpointDto } from './dto/update-endpoint.dto'

export interface PaginationOptions {
  page?: number
  limit?: number
}

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

  async findAll(options?: PaginationOptions) {
    const { page = 1, limit = 10 } = options || {}
    const skip = (page - 1) * limit

    const [items, total] = await this.endpointRepository.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    })

    const totalPages = Math.ceil(total / limit)

    return {
      items,
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      offset: skip,
    }
  }

  async findByUserId(userId: number, options?: PaginationOptions) {
    const { page = 1, limit = 10 } = options || {}
    const skip = (page - 1) * limit

    const [items, total] = await this.endpointRepository.findAndCount({
      where: { userId },
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    })

    const totalPages = Math.ceil(total / limit)

    return {
      items,
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      offset: skip,
    }
  }

  async findOne(id: string) {
    return await this.endpointRepository.findOne({ where: { id } })
  }

  async update(
    id: string,
    updateEndpointDto: UpdateEndpointDto,
    userId: number,
  ) {
    const updateData = {
      ...updateEndpointDto,
      userId,
      parameter: updateEndpointDto.parameter || {},
    }
    await this.endpointRepository.update(id, updateData)
    return await this.findOne(id)
  }

  async remove(id: string) {
    return await this.endpointRepository.delete(id)
  }
}
