import { FileRepository } from './../data/files/file.repository';
import { FolderRepository } from './../data/folders/folder.repository';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Folder } from 'src/data/folders/folder.entity';

@Injectable()
export class FileManagerService {
  constructor(
    private readonly folderRepository: FolderRepository,
    private readonly fileRepository: FileRepository,
  ) {}

  public getAllFolders(userID: string) {
    return this.folderRepository.findByOwnerID(userID);
  }

  async newFolder(userID: string, folderName: string) {
    let folder = await this.folderRepository.findByOwnerIDAndName(
      userID,
      folderName,
    );
    if (folder) {
      throw new HttpException(
        'Exists another folder with same name',
        HttpStatus.CONFLICT,
      );
    }
    folder = new Folder();
    folder.ownerID = userID;
    folder.created = new Date();
    folder.name = folderName;
    return await this.folderRepository.save(folder);
  }

  async updateFolder(userID: string, folderID, folderName: string) {
    const folder = await this.folderRepository.findByID(folderID);
    if (!folder) {
      throw new HttpException(`Folder doesn't exist`, HttpStatus.BAD_REQUEST);
    }
    if (folder.ownerID !== userID) {
      throw new HttpException(
        'This folder is not yours',
        HttpStatus.BAD_REQUEST,
      );
    }
    folder.name = folderName;
    return await this.folderRepository.save(folder);
  }

  async deleteFolder(userID: string, folderID) {
    const folder = await this.folderRepository.findByID(folderID);
    if (!folder) {
      throw new HttpException(`Folder doesn't exist`, HttpStatus.BAD_REQUEST);
    }
    if (folder.ownerID !== userID) {
      throw new HttpException(
        'This folder is not yours',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.folderRepository.remove(folder);
  }
}
