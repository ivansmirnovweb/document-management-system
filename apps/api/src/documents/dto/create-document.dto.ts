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

  @IsString()
  @MinLength(1)
  about1!: string;

  @IsOptional()
  @IsString()
  about2?: string | null;

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
  @MinLength(1)
  outgoingNumber!: string;

  @IsDateString()
  outgoingDate!: string;

  @IsInt()
  @Min(1)
  employerId!: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  outSenderEmployerId?: number | null;

  @IsOptional()
  @IsString()
  broadcast?: string;

  @IsInt()
  @Min(1)
  ownerId!: number;

  @IsInt()
  @Min(1)
  executorId!: number;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsBoolean()
  isControl?: boolean;
}
