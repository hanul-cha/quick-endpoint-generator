import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common'
import { DataRowService } from './data-row.service'

@Controller('data-rows')
export class DataRowController {
  constructor(private readonly dataRowService: DataRowService) {}

  @Post()
  async create(
    @Body()
    body: {
      dataTableId: string
      values: { columnId: string; value: any }[]
    },
  ) {
    return await this.dataRowService.create(body.dataTableId, body.values)
  }

  @Get('table/:dataTableId')
  async findAll(@Param('dataTableId') dataTableId: string) {
    return await this.dataRowService.findAll(dataTableId)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.dataRowService.findOne(id)
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { values: { columnId: string; value: any }[] },
  ) {
    return await this.dataRowService.update(id, body.values)
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.dataRowService.remove(id)
  }
}
