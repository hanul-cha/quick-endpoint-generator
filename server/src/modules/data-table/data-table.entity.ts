import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { DataRow } from '../data-row/data-row.entity'
import { GlobalPrimitive } from 'src/app.types'

export interface DataColumn {
  id: string
  name: string
  type: GlobalPrimitive
}

@Entity()
export class DataTable {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column('jsonb')
  columns: DataColumn[]

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
