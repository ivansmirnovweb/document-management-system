import { IsEnum } from 'class-validator';
import { DocumentStatus } from '@document-flow/shared';

export class UpdateDocumentStatusDto {
  @IsEnum(DocumentStatus)
  status!: DocumentStatus;
}
