import { User } from './user.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

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
}
