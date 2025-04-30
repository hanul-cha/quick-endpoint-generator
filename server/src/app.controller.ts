import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'

import { AppService, EndpointRunOptions } from './app.service'
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard'
import { CurrentUser } from './modules/auth/decorators/current-user.decorator'
import { User } from './modules/users/entities/user.entity'

@UseGuards(JwtAuthGuard)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':endpointId')
  async getRequest(
    @Param('endpointId') endpointId: string,
    @Query() query: Record<string, string>,
    @Body() body: Record<string, string>,
    @CurrentUser() user: User,
  ) {
    const options: EndpointRunOptions = {
      query,
      body,
      context: { userId: user.id },
    }
    return this.appService.runEndpoint(endpointId, options)
  }

  @Post(':endpointId')
  async postRequest(
    @Param('endpointId') endpointId: string,
    @Query() query: Record<string, string>,
    @Body() body: Record<string, string>,
    @CurrentUser() user: User,
  ) {
    const options: EndpointRunOptions = {
      query,
      body,
      context: { userId: user.id },
    }
    return this.appService.runEndpoint(endpointId, options)
  }

  @Put(':endpointId')
  async putRequest(
    @Param('endpointId') endpointId: string,
    @Query() query: Record<string, string>,
    @Body() body: Record<string, string>,
    @CurrentUser() user: User,
  ) {
    const options: EndpointRunOptions = {
      query,
      body,
      context: { userId: user.id },
    }
    return this.appService.runEndpoint(endpointId, options)
  }

  @Delete(':endpointId')
  async deleteRequest(
    @Param('endpointId') endpointId: string,
    @Query() query: Record<string, string>,
    @Body() body: Record<string, string>,
    @CurrentUser() user: User,
  ) {
    const options: EndpointRunOptions = {
      query,
      body,
      context: { userId: user.id },
    }
    return this.appService.runEndpoint(endpointId, options)
  }
}
