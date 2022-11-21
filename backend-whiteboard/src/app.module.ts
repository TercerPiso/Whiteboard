import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppleLoginModule } from './apple-login/apple-login.module';
import { environment } from './environment';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth/auth.service';
import { DataModule } from './data/data.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forRoot(environment.db),
    DataModule,
    AppleLoginModule,
    AuthModule,
  ],
  controllers: [],
  providers: [JwtStrategy],
})
export class AppModule {}
