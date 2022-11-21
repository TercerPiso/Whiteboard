import { FolderRepository } from './folders/file.repository';
import { FileRepository } from './files/file.repository';
import { Folder } from './folders/folder.entity';
import { WBFile } from './files/file.entity';
import { UserRepository } from './users/user.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, WBFile, Folder])],
  providers: [UserRepository, FileRepository, FolderRepository],
  exports: [UserRepository, FileRepository, FolderRepository],
})
export class DataModule {}
