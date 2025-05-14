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
import { DataTableService, PaginationOptions } from './data-table.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { User } from '../users/entities/user.entity'
import { DataColumn } from './data-table.entity'

@Controller('data-tables')
@UseGuards(JwtAuthGuard)
export class DataTableController {
  constructor(private readonly dataTableService: DataTableService) {}

  @Post()
  async create(
    @Body()
    body: {
      name: string
      columns: DataColumn[]
    },
    @CurrentUser() user: User,
  ) {
    return await this.dataTableService.create(body.name, body.columns, user.id)
  }

  @Get()
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    const options: PaginationOptions = {
      page: page ? parseInt(page.toString()) : 1,
      limit: limit ? parseInt(limit.toString()) : 10,
    }
    return await this.dataTableService.findAll(options)
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
    return await this.dataTableService.findByUserId(user.id, options)
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
      columns: DataColumn[]
    },
    @CurrentUser() user: User,
  ) {
    return await this.dataTableService.update(
      id,
      body.name,
      body.columns,
      user.id,
    )
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.dataTableService.remove(id)
  }
}
