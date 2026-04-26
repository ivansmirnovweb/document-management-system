import { IsEnum, IsOptional } from 'class-validator';
import { DocumentStatus } from '@document-flow/shared';

export class ListDocumentsQueryDto {
  @IsOptional()
  @IsEnum(DocumentStatus)
  status?: DocumentStatus;
}
