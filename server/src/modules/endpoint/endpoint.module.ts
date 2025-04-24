import { Endpoint } from './endpoint.entity'
import { EndpointController } from './endpoint.controller'
import { EndpointService } from './endpoint.service'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([Endpoint])],
  controllers: [EndpointController],
  providers: [EndpointService],
  exports: [EndpointService],
})
export class EndpointModule {}
