import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { RolesGuard } from './common/guards/roles.guard';
import { ResponseEnvelopeInterceptor } from './common/interceptors/response-envelope.interceptor';
import { AuthModule } from './auth/auth.module';
import { JwtCookieAuthGuard } from './auth/auth.guard';
import { AppConfigModule } from './config/app-config.module';
import { DbModule } from './db/db.module';
import { HealthModule } from './health/health.module';
import { EmployersModule } from './employers/employers.module';
import { DocumentsModule } from './documents/documents.module';

@Module({
  imports: [
    AppConfigModule,
    DbModule,
    HealthModule,
    AuthModule,
    EmployersModule,
    DocumentsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseEnvelopeInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtCookieAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
