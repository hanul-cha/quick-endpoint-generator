import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { DataRow } from './modules/data-row/data-row.entity'
import { DataRowController } from './modules/data-row/data-row.controller'
import { DataRowModule } from './modules/data-row/data-row.module'
import { DataRowService } from './modules/data-row/data-row.service'
import { DataTable } from './modules/data-table/data-table.entity'
import { DataTableController } from './modules/data-table/data-table.controller'
import { DataTableModule } from './modules/data-table/data-table.module'
import { DataTableService } from './modules/data-table/data-table.service'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from './modules/users/users.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [DataTable, DataRow],
      synchronize: true, // 개발 환경에서만 true로 설정
    }),
    TypeOrmModule.forFeature([DataTable, DataRow]),
    DataTableModule,
    DataRowModule,
    UsersModule,
  ],
  controllers: [AppController, DataTableController, DataRowController],
  providers: [AppService, DataTableService, DataRowService],
})
export class AppModule {}
