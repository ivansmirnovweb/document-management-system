import { IsDateString, IsString, MinLength } from 'class-validator';

export class CreateResolutionDto {
  @IsString()
  @MinLength(1)
  text!: string;

  @IsDateString()
  resolutionDate!: string;

  @IsDateString()
  dueDate!: string;
}
