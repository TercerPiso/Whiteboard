import { Folder } from './folder.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as mongodb from 'mongodb';

@Injectable()
export class FolderRepository {
  constructor(
    @InjectRepository(Folder)
    private folderRepository: Repository<Folder>,
  ) {}

  public save(folder: Folder) {
    return this.folderRepository.save(folder);
  }

  public findByOwnerID(ownerID: string) {
    return this.folderRepository.findBy({ ownerID });
  }

  public findByID(folderID: string) {
    return this.folderRepository.findOneBy({
      _id: new mongodb.ObjectID(folderID),
    });
  }

  public findByOwnerIDAndName(ownerID: string, name: string) {
    return this.folderRepository.findOneBy({ ownerID, name });
  }

  public remove(folder: Folder) {
    this.folderRepository.delete(folder);
  }
}
