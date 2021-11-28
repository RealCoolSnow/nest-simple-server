import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column('varchar', { length: 128 })
  name: string

  @Column('int')
  age: number

  @Column('timestamp')
  create_time: number

  @Column('timestamp')
  update_time: number
}
