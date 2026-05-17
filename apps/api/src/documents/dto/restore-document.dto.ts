import { IsInt, Min } from 'class-validator';

export class RestoreDocumentDto {
  @IsInt()
  @Min(1)
  ownerId!: number;
}

