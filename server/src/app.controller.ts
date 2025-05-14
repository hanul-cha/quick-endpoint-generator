import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common'

import { AppService, EndpointRunOptions } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('run/:endpointId')
  async getRequest(
    @Param('endpointId') endpointId: string,
    @Query() query: Record<string, string>,
    @Body() body: Record<string, string>,
  ) {
    const options: EndpointRunOptions = {
      query,
      body,
    }
    return this.appService.runEndpoint(endpointId, options)
  }

  @Post('run/:endpointId')
  async postRequest(
    @Param('endpointId') endpointId: string,
    @Query() query: Record<string, string>,
    @Body() body: Record<string, string>,
  ) {
    const options: EndpointRunOptions = {
      query,
      body,
    }
    return this.appService.runEndpoint(endpointId, options)
  }

  @Put('run/:endpointId')
  async putRequest(
    @Param('endpointId') endpointId: string,
    @Query() query: Record<string, string>,
    @Body() body: Record<string, string>,
  ) {
    const options: EndpointRunOptions = {
      query,
      body,
    }
    return this.appService.runEndpoint(endpointId, options)
  }

  @Delete('run/:endpointId')
  async deleteRequest(
    @Param('endpointId') endpointId: string,
    @Query() query: Record<string, string>,
    @Body() body: Record<string, string>,
  ) {
    const options: EndpointRunOptions = {
      query,
      body,
    }
    return this.appService.runEndpoint(endpointId, options)
  }
}
