import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { DataRowModule } from '../data-row/data-row.module'
import { DataTableModule } from '../data-table/data-table.module'
import { EndpointModule } from '../endpoint/endpoint.module'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './strategies/jwt.strategy'
import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../users/entities/user.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    EndpointModule,
    DataTableModule,
    DataRowModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
