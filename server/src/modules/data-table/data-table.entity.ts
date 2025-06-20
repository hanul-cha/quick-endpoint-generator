import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'

import { DataRow } from '../data-row/data-row.entity'
import { Type } from 'class-transformer'

export enum DataColumnType {
  String = 'String',
  Number = 'Number',
  Boolean = 'Boolean',
  Date = 'Date',
  Json = 'Json',
}

export class DataColumn {
  id: string

  @IsString()
  @IsNotEmpty()
  name: string

  @IsEnum(DataColumnType)
  @IsNotEmpty()
  type: DataColumnType

  @IsBoolean()
  @IsOptional()
  required?: boolean
}

@Entity()
export class DataTable {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  @IsString()
  @IsNotEmpty()
  name: string

  @Column({ type: 'jsonb', nullable: true })
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => DataColumn)
  @IsArray()
  @IsOptional()
  columns?: DataColumn[]

  @Column({ nullable: true })
  userId: number

  @OneToMany(() => DataRow, (dataRow) => dataRow.dataTable)
  dataRows: DataRow[]

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date
}
