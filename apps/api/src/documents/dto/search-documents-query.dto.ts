import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { DocumentStatus } from '@document-flow/shared';

export class SearchDocumentsQueryDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  q?: string;

  @IsOptional()
  @IsEnum(DocumentStatus)
  status?: DocumentStatus;
}
