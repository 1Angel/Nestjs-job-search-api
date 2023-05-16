import { IsOptional, IsString } from 'class-validator';

export class CreateJobRequestDto {
  @IsString()
  @IsOptional()
  description?: string;
}
