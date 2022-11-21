import { Module } from '@nestjs/common';
import { AppleLoginService } from './apple-login.service';
import { AppleLoginController } from './apple-login.controller';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [HttpModule, AuthModule],
  providers: [AppleLoginService],
  controllers: [AppleLoginController],
})
export class AppleLoginModule {}
