import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

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
    type: 'enum',
    enum: ['body', 'query'],
    default: 'body',
  })
  parameterType: 'body' | 'query'

  @Column({
    type: 'json',
    nullable: true,
  })
  parameter: object

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
