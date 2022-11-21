import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WBFile } from './file.entity';
import * as mongodb from 'mongodb';

@Injectable()
export class FileRepository {
  constructor(
    @InjectRepository(WBFile)
    private fileRepository: Repository<WBFile>,
  ) {}

  public findByFolder(folderID: string) {
    return this.fileRepository.findBy({
      folderID,
    });
  }

  public findByID(fileID: string) {
    return this.fileRepository.findOneBy({
      _id: new mongodb.ObjectID(fileID),
    });
  }

  public save(file: WBFile) {
    return this.fileRepository.save(file);
  }

  public remove(file: WBFile) {
    return this.fileRepository.delete(file);
  }
}
