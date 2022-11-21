import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity('notifications')
export class User {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column({ default: 10 })
  maxDocuments: number;

  @Column({ default: 0 })
  currentDocuments: number;

  @Column()
  appleID: string;

  @Column()
  googleID: string;

  @Column()
  created: Date;
}
