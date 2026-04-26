import { IsInt, Min } from 'class-validator';

export class ReassignDocumentDto {
  @IsInt()
  @Min(1)
  ownerId!: number;
}
