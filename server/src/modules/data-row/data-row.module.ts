import { DataRow } from './data-row.entity'
import { DataRowController } from './data-row.controller'
import { DataRowService } from './data-row.service'
import { DataTableModule } from '../data-table/data-table.module'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([DataRow]), DataTableModule],
  controllers: [DataRowController],
  providers: [DataRowService],
  exports: [DataRowService],
})
export class DataRowModule {}
