import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsISO8601,
  IsOptional,
  IsInt,
} from 'class-validator';
import { DocumentStatus } from '@document-flow/shared';

const toBoolean = ({ value }: { value: unknown }): boolean =>
  value === true || value === 'true';

export class ReportFilterDto {
  @IsISO8601()
  dateFrom!: string;

  @IsISO8601()
  dateTo!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  executorId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  ownerId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  employerId?: number;

  @IsOptional()
  @IsEnum(DocumentStatus)
  status?: DocumentStatus;

  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  includeDeleted?: boolean;
}
