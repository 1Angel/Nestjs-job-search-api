import { IsString, MaxLength, MinLength } from "class-validator";


export class LoginUserDto{

    @IsString()
    @MinLength(5)
    @MaxLength(50)
    email: string;
  
    @IsString()
    @MinLength(5)
    @MaxLength(50)
    password: string;
}