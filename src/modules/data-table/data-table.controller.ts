import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common'
import { DataTableService } from './data-table.service'

@Controller('data-tables')
export class DataTableController {
  constructor(private readonly dataTableService: DataTableService) {}

  @Post()
  async create(
    @Body()
    body: {
      name: string
      columns: { id: string; name: string; type: string }[]
    },
  ) {
    return await this.dataTableService.create(body.name, body.columns)
  }

  @Get()
  async findAll() {
    return await this.dataTableService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.dataTableService.findOne(id)
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      name: string
      columns: { id: string; name: string; type: string }[]
    },
  ) {
    return await this.dataTableService.update(id, body.name, body.columns)
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.dataTableService.remove(id)
  }
}
