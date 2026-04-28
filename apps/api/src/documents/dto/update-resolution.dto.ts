import { IsDateString, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateResolutionDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  text?: string;

  @IsOptional()
  @IsDateString()
  resolutionDate?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}
