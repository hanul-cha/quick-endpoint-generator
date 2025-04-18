import { DataTable } from './data-table.entity'
import { DataTableController } from './data-table.controller'
import { DataTableService } from './data-table.service'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([DataTable])],
  controllers: [DataTableController],
  providers: [DataTableService],
  exports: [DataTableService],
})
export class DataTableModule {}
