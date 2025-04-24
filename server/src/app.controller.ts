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

import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':id')
  getRequest(
    @Param('id') id: string,
    @Query() query: Record<string, string>,
    @Body() body: Record<string, string>,
  ): Promise<string> {
    console.log(id, query, body)
    return this.appService.runEndpoint(id, {
      query,
      body,
    })
  }

  @Post(':id')
  postRequest(
    @Param('id') id: string,
    @Body() body: Record<string, string>,
  ): Promise<string> {
    return this.appService.runEndpoint(id, { body })
  }

  @Put(':id')
  putRequest(
    @Param('id') id: string,
    @Body() body: Record<string, string>,
  ): Promise<string> {
    return this.appService.runEndpoint(id, { body })
  }

  @Delete(':id')
  deleteRequest(@Param('id') id: string): Promise<string> {
    return this.appService.runEndpoint(id, {})
  }
}
