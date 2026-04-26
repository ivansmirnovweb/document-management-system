import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigModule } from '../config/app-config.module';
import { AppConfigService } from '../config/app-config.service';
import { DbModule } from '../db/db.module';
import { AuthController } from './auth.controller';
import { JwtCookieAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Module({
  imports: [
    DbModule,
    AppConfigModule,
    JwtModule.registerAsync({
      inject: [AppConfigService],
      imports: [AppConfigModule],
      useFactory: (config: AppConfigService) => ({
        secret: config.jwtSecret,
        signOptions: {
          expiresIn: '90d',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtCookieAuthGuard],
  exports: [AuthService, JwtCookieAuthGuard],
})
export class AuthModule {}
