import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppleLoginModule } from './apple-login/apple-login.module';
import { environment } from './environment';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    AppleLoginModule,
    HttpModule,
    TypeOrmModule.forRoot(environment.db),
    JwtModule.register({
      secret: environment.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [],
  providers: [AuthService, JwtStrategy],
})
export class AppModule {}
