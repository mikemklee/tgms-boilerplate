import { Entity, ObjectIdColumn, ObjectID, Column, BaseEntity } from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column('text')
  email: string;

  @Column('text', { nullable: true })
  stripeId: string;

  @Column('text', { default: 'free-trial' })
  type: string;

  @Column('text', { nullable: true })
  ccLast4: string;

  @Column('text')
  password: string;
}
