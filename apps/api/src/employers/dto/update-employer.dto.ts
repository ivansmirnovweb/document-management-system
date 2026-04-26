import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateEmployerDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  fullName?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  shortName?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  legalAddress?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  actualAddress?: string;
}
