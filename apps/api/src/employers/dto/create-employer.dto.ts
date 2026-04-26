import { IsString, MinLength } from 'class-validator';

export class CreateEmployerDto {
  @IsString()
  @MinLength(1)
  fullName!: string;

  @IsString()
  @MinLength(1)
  shortName!: string;

  @IsString()
  @MinLength(1)
  legalAddress!: string;

  @IsString()
  @MinLength(1)
  actualAddress!: string;
}
