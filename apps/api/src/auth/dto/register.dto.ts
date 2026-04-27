import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @Matches(/^[a-z0-9._-]+$/)
  username!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  displayName!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}
