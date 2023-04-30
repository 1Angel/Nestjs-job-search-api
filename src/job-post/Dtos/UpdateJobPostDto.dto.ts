import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateJobPostDto {
  @IsString()
  @MaxLength(50)
  @MinLength(5)
  title: string;

  @IsString()
  @MaxLength(500)
  @MinLength(5)
  description: string;
}
