import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity('files')
export class WBFile {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  ownerID: string;

  @Column()
  folderID: string;

  @Column()
  preview: string;

  @Column()
  fullFile: string;

  @Column()
  name: string;

  @Column()
  created: Date;
}
