import { User } from './../data/users/user.entity';
import { UserRepository } from './../data/users/user.repository';
import { SessionType, TokenData } from './auth.domain';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { environment } from 'src/environment';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtSrv: JwtService,
    private readonly userRepo: UserRepository,
  ) {}

  async makeAppleSession(userID: string) {
    const user = await this.userRepo.findByAppleID(userID);
    if (user) {
      return this.generateJWT(user._id.toString(), SessionType.LOGIN);
    } else {
      const localUser = new User();
      localUser.appleID = userID;
      localUser.created = new Date();
      const u = await this.userRepo.save(localUser);
      return this.generateJWT(u._id.toString(), SessionType.SIGNUP);
    }
  }

  public generateJWT(userID: string, type: SessionType) {
    const out = new TokenData();
    out.token = this.jwtSrv.sign(
      {
        iat: new Date().getTime(),
        iss: environment.JWT_ISSUER,
        sub: userID,
        aud: 'whiteboard.tercerpiso.net',
      },
      {
        expiresIn: environment.JWT_DURATION,
      },
    );
    out.expiration = JSON.parse(
      Buffer.from(out.token.split('.')[1], 'base64').toString(),
    ).exp;
    out.sessionType = type;
    return out;
  }
}
