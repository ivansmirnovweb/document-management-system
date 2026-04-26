import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  @MinLength(1)
  registrationNumber!: string;

  @IsDateString()
  registrationDate!: string;

  @IsString()
  @MinLength(1)
  title!: string;

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
