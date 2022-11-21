import { Module } from '@nestjs/common';
import { AppleLoginService } from './apple-login.service';
import { AppleLoginController } from './apple-login.controller';
import { HttpModule } from '@nestjs/axios';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [HttpModule],
  providers: [AppleLoginService, AuthService],
  controllers: [AppleLoginController],
})
export class AppleLoginModule {}
