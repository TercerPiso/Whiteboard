import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DataModule } from 'src/data/data.module';
import { environment } from 'src/environment';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({
      secret: environment.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
    DataModule,
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
