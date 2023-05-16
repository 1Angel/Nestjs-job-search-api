import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  username: string;

  @IsString()
  @MinLength(5)
  @MaxLength(50)
  email: string;

  @IsString()
  @MinLength(5)
  @MaxLength(50)
  password: string;
}
