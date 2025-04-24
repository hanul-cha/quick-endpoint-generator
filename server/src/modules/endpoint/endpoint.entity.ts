import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { GlobalPrimitive } from 'src/app.types'

@Entity()
export class Endpoint {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  userId: number

  @Column({
    nullable: true,
    type: 'text',
  })
  script: string

  @Column({
    type: 'json',
    nullable: true,
  })
  parameter: Record<string, GlobalPrimitive>

  @Column({
    type: 'enum',
    enum: ['GET', 'POST', 'PUT', 'DELETE'],
    default: 'GET',
  })
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date
}
