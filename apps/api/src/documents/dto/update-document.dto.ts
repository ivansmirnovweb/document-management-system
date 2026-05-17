import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { DocumentKind, DocumentStatus } from '@document-flow/shared';

export class UpdateDocumentDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  registrationNumber?: string;

  @IsOptional()
  @IsDateString()
  registrationDate?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  about1?: string;

  @IsOptional()
  @IsString()
  about2?: string | null;

  @IsOptional()
  @IsEnum(DocumentKind)
  kind?: DocumentKind;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsString()
  incomingNumber?: string | null;

  @IsOptional()
  @IsString()
  @MinLength(1)
  outgoingNumber?: string;

  @IsOptional()
  @IsDateString()
  outgoingDate?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  employerId?: number | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  outSenderEmployerId?: number | null;

  @IsOptional()
  @IsString()
  broadcast?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  ownerId?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  executorId?: number;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsEnum(DocumentStatus)
  status?: DocumentStatus;

  @IsOptional()
  @IsBoolean()
  isControl?: boolean;
}
