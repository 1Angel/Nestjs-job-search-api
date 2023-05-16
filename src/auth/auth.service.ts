import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './Dtos/CreateUser.Dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/User.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './Dtos/LoginUser.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly UserRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async GeneratedToken(payload: any) {
    const token = await this.jwtService.signAsync(payload);
    return token;
  }

  async CreateUser(createUserDto: CreateUserDto) {
    const { email, password, ...userData } = createUserDto;

    const user = this.UserRepository.create({
      ...userData,
      email,
      password: bcrypt.hashSync(password, 10),
    });

    const findEmail = await this.UserRepository.findOneBy({ email });
    if (findEmail) {
      throw new BadRequestException(`email ${email} exist`);
    }

    const save = await this.UserRepository.save(user);
    delete user.password;

    const payload = {
      id: save.id,
      username: save.username,
      email: save.email,
      roles: save.roles,
    };

    return {
      save,
      access_token: await this.GeneratedToken(payload),
    };
  }

  async LoginUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const findEmail = await this.UserRepository.findOneBy({ email });
    if (!findEmail) {
      throw new NotFoundException(`email ${email} not found`);
    }
    const ComparePassword = await bcrypt.compareSync(
      password,
      findEmail.password,
    );
    if (!ComparePassword) {
      throw new BadRequestException(`password dont match`);
    }
    delete findEmail.password;

    const payload = {
      id: findEmail.id,
      username: findEmail.username,
      email: findEmail.email,
      roles: findEmail.roles,
    };

    return {
      findEmail,
      access_token: await this.GeneratedToken(payload),
    };
  }
}
