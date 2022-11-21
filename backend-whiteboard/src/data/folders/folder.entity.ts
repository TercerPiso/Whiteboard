import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity('folders')
export class Folder {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  ownerID: string;

  @Column()
  name: string;

  @Column()
  created: Date;
}
