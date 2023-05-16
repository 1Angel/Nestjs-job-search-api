import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './Dtos/CreateUser.Dto';
import { LoginUserDto } from './Dtos/LoginUser.dto';
import { AuthGuard } from './Guards/auth.guard';
import { RolesGuard } from './Guards/roles.guard';
import { Role } from './entity/Role.entity';
import { HasRoles } from './Decorators/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  CreateUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.CreateUser(createUserDto);
  }

  @Post('login')
  LoginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.LoginUser(loginUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('hola')
  Hello() {
    return {
      msg: 'hello mister',
    };
  }

  @Get('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @HasRoles(Role.Admin)
  OnlyAdmin(@Request() req) {
    console.log(req.user);
    return {
      message: 'only admin user can see this message',
    };
  }
}
