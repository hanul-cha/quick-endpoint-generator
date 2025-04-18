import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common'
import { DataRowService } from './data-row.service'
import { PaginationOptions } from '../data-table/data-table.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { User } from '../users/entities/user.entity'

@Controller('data-rows')
@UseGuards(JwtAuthGuard)
export class DataRowController {
  constructor(private readonly dataRowService: DataRowService) {}

  @Post()
  async create(
    @Body()
    body: {
      dataTableId: string
      values: Record<string, any>
    },
  ) {
    return await this.dataRowService.create(body.dataTableId, body.values)
  }

  @Get('table/:dataTableId')
  async findAll(
    @Param('dataTableId') dataTableId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const options: PaginationOptions = {
      page: page ? parseInt(page.toString()) : 1,
      limit: limit ? parseInt(limit.toString()) : 10,
    }
    return await this.dataRowService.findAll(dataTableId, options)
  }

  @Get('my')
  async findByCurrentUser(
    @CurrentUser() user: User,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const options: PaginationOptions = {
      page: page ? parseInt(page.toString()) : 1,
      limit: limit ? parseInt(limit.toString()) : 10,
    }
    return await this.dataRowService.findByUserId(user.id.toString(), options)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.dataRowService.findOne(id)
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      values: Record<string, any>
    },
  ) {
    return await this.dataRowService.update(id, body.values)
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.dataRowService.remove(id)
  }
}
