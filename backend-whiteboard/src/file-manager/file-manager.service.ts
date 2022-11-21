import { UserRepository } from './../data/users/user.repository';
import { FileRepository } from './../data/files/file.repository';
import { FolderRepository } from './../data/folders/folder.repository';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Folder } from 'src/data/folders/folder.entity';
import { FileData } from './file-manager.domain';
import { WBFile } from 'src/data/files/file.entity';

@Injectable()
export class FileManagerService {
  constructor(
    private readonly folderRepository: FolderRepository,
    private readonly fileRepository: FileRepository,
    private readonly userRepository: UserRepository,
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

  async getFilesInFolder(userID: string, folderID: string) {
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
    return await this.fileRepository.findByFolder(folderID);
  }

  async createFileInFolder(userID: string, file: FileData) {
    const folder = await this.folderRepository.findByID(file.folderID);
    if (!folder) {
      throw new HttpException(`Folder doesn't exist`, HttpStatus.BAD_REQUEST);
    }
    if (folder.ownerID !== userID) {
      throw new HttpException(
        'This folder is not yours',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.userRepository.findByID(userID);
    if (user.currentDocuments >= user.maxDocuments) {
      throw new HttpException(
        `No documents left.`,
        HttpStatus.PAYMENT_REQUIRED,
      );
    }
    const wbFile = new WBFile();
    wbFile.created = new Date();
    wbFile.folderID = file.folderID;
    wbFile.name = file.name;
    wbFile.ownerID = userID;
    wbFile.fullFile = file.content;
    wbFile.preview = file.preview;
    const savedFile = await this.fileRepository.save(wbFile);
    return { fileID: savedFile._id.toString() };
  }

  async updateFile(userID: string, fileID: string, file: FileData) {
    const dbFile = await this.fileRepository.findByID(fileID);
    if (!dbFile) {
      throw new HttpException(`File doesn't exists`, HttpStatus.NOT_FOUND);
    }
    if (dbFile.ownerID !== userID) {
      throw new HttpException('This file is not yours', HttpStatus.BAD_REQUEST);
    }
    if (file.name) {
      dbFile.name = file.name;
    }
    if (file.folderID) {
      const folder = await this.folderRepository.findByID(file.folderID);
      if (!folder) {
        throw new HttpException(`Folder doesn't exist`, HttpStatus.BAD_REQUEST);
      }
      if (folder.ownerID !== userID) {
        throw new HttpException(
          'This folder is not yours',
          HttpStatus.BAD_REQUEST,
        );
      }
      dbFile.folderID = file.folderID;
    }
    dbFile.fullFile = file.content;
    dbFile.preview = file.preview;
    const savedFile = await this.fileRepository.save(dbFile);
    return { fileID: savedFile._id.toString() };
  }

  async deleteFile(userID: string, fileID: string) {
    const dbFile = await this.fileRepository.findByID(fileID);
    if (!dbFile) {
      throw new HttpException(`File doesn't exists`, HttpStatus.NOT_FOUND);
    }
    if (dbFile.ownerID !== userID) {
      throw new HttpException('This file is not yours', HttpStatus.BAD_REQUEST);
    }
    return this.fileRepository.remove(dbFile);
  }
}
