import { User } from './user.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as mongodb from 'mongodb';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  public save(user: User) {
    return this.userRepository.save(user);
  }

  public findByAppleID(appleID: string) {
    return this.userRepository.findOneBy({
      appleID,
    });
  }

  public findByID(id: string) {
    return this.userRepository.findOneByOrFail({
      _id: new mongodb.ObjectID(id),
    });
  }
}
