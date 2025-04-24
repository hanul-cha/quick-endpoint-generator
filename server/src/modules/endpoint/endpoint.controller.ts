import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common'
import { EndpointService } from './endpoint.service'
import { CreateEndpointDto } from './dto/create-endpoint.dto'
import { UpdateEndpointDto } from './dto/update-endpoint.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { User } from '../users/entities/user.entity'

interface PaginationOptions {
  page?: number
  limit?: number
}

@Controller('endpoints')
@UseGuards(JwtAuthGuard)
export class EndpointController {
  constructor(private readonly endpointService: EndpointService) {}

  @Post()
  async create(
    @Body() createEndpointDto: CreateEndpointDto,
    @CurrentUser() user: User,
  ) {
    return await this.endpointService.create(createEndpointDto, user.id)
  }

  @Get()
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    const options: PaginationOptions = {
      page: page ? parseInt(page.toString()) : 1,
      limit: limit ? parseInt(limit.toString()) : 10,
    }
    return await this.endpointService.findAll(options)
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
    return await this.endpointService.findByUserId(user.id, options)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.endpointService.findOne(id)
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEndpointDto: UpdateEndpointDto,
    @CurrentUser() user: User,
  ) {
    return await this.endpointService.update(id, updateEndpointDto, user.id)
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.endpointService.remove(id)
  }
}
