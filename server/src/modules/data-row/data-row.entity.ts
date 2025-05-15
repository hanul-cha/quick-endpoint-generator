import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { IsObject, IsOptional, IsUUID } from 'class-validator'

import { DataTable } from '../data-table/data-table.entity'

@Entity()
export class DataRow {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('uuid')
  @IsUUID()
  dataTableId: string

  @ManyToOne(() => DataTable, (dataTable) => dataTable.dataRows)
  @JoinColumn({ name: 'dataTableId' })
  dataTable: DataTable

  @Column('jsonb')
  @IsObject()
  @IsOptional()
  values?: Record<string, any>

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date
}
