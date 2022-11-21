import { DataModule } from 'src/data/data.module';
import { Module } from '@nestjs/common';
import { FileManagerController } from './file-manager.controller';
import { FileManagerService } from './file-manager.service';

@Module({
  imports: [DataModule],
  controllers: [FileManagerController],
  providers: [FileManagerService],
})
export class FileManagerModule {}
