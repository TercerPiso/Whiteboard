import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WBFile } from './file.entity';

@Injectable()
export class FileRepository {
  constructor(
    @InjectRepository(WBFile)
    private fileRepository: Repository<WBFile>,
  ) {}

  public save(file: WBFile) {
    return this.fileRepository.save(file);
  }
}
