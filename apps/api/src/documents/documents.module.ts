import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentPermissionsService } from './document-permissions.service';
import { DocumentsService } from './documents.service';

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService, DocumentPermissionsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
