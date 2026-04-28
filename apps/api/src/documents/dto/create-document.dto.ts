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
import { DocumentKind } from '@document-flow/shared';

export class CreateDocumentDto {
  @IsString()
  @MinLength(1)
  registrationNumber!: string;

  @IsDateString()
  registrationDate!: string;

  @IsString()
  @MinLength(1)
  title!: string;

  @IsEnum(DocumentKind)
  kind!: DocumentKind;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsString()
  incomingNumber?: string | null;

  @IsOptional()
  @IsString()
  outgoingNumber?: string | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  employerId?: number | null;

  @IsInt()
  @Min(1)
  ownerId!: number;

  @IsInt()
  @Min(1)
  executorId!: number;

  @IsDateString()
  dueDate!: string;

  @IsOptional()
  @IsBoolean()
  isControl?: boolean;
}
