import { Entity, ObjectIdColumn, ObjectID, Column, BaseEntity } from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column('text')
  email: string;

  @Column('text')
  password: string;
}
