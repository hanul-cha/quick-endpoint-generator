import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DataTable } from './data-table.entity'

@Injectable()
export class DataTableService {
  constructor(
    @InjectRepository(DataTable)
    private dataTableRepository: Repository<DataTable>,
  ) {}

  async create(
    name: string,
    columns: { id: string; name: string; type: string }[],
  ) {
    const dataTable = this.dataTableRepository.create({
      name,
      columns,
    })
    return await this.dataTableRepository.save(dataTable)
  }

  async findAll() {
    return await this.dataTableRepository.find()
  }

  async findOne(id: string) {
    return await this.dataTableRepository.findOne({ where: { id } })
  }

  async update(
    id: string,
    name: string,
    columns: { id: string; name: string; type: string }[],
  ) {
    await this.dataTableRepository.update(id, { name, columns })
    return await this.findOne(id)
  }

  async remove(id: string) {
    return await this.dataTableRepository.delete(id)
  }
}
