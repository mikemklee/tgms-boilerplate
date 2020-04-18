import { Entity, ObjectIdColumn, ObjectID, Column, BaseEntity } from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column('text')
  email: string;

  @Column('text', { nullable: true })
  stripeId: string | null;

  @Column('text', { default: 'trial' })
  type: string;

  @Column('text', { nullable: true })
  ccLast4: string | null;

  @Column('text')
  password: string;
}
