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
  preview: string; // TODO: change this for S3 Bucket

  @Column()
  fullFile: string; // TODO: change this for S3 Bucket

  @Column()
  name: string;

  @Column()
  created: Date;

  @Column()
  lastUpdate: Date;
}
