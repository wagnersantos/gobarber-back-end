import {
  ObjectID,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ObjectIdColumn,
} from 'typeorm';

@Entity('notifications')
export default class Notification {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  content: string;

  @Column('uuid')
  recipientId: string;

  @Column({ default: false })
  read: boolean;

  @CreateDateColumn()
  cratedAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
