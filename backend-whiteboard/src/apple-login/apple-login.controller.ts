import { AuthService } from '../auth/auth.service';
import { HttpStatusCode } from './../../node_modules/axios/index.d';
import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { AppleSignInResponse } from './apple-login.domain';
import { AppleLoginService } from './apple-login.service';

@Controller('apple-login')
export class AppleLoginController {
  constructor(
    private readonly appleLoginSrv: AppleLoginService,
    private readonly authSrv: AuthService,
  ) {}

  @Post()
  async generateNewSession(@Body() asir: AppleSignInResponse) {
    const appleToken = await this.appleLoginSrv.validateToken(asir);
    if (appleToken.error) {
      throw new HttpException(
        'Invalid Apple Token',
        HttpStatusCode.Unauthorized,
      );
    }
    return this.authSrv.makeAppleSession(appleToken.payload.sub);
  }
}
