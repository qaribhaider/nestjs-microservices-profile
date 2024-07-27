import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { CreateUserDto } from './users/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  getHello(): { message: string; status: string } {
    return {
      message: 'Welcome to auth service',
      status: 'success',
    };
  }

  async registerUser(createUser: CreateUserDto) {
    let user = null;
    try {
      user = await this.usersService.getUserByEmail(createUser.email);
    } catch (error) {
      // We generally get an error here when the user doesn't exist
      // so we can continue to create the user
    }

    if (user) {
      throw new UnprocessableEntityException('Email already exists.');
    }

    return this.usersService.create({
      ...createUser,
      password: await bcrypt.hash(createUser.password, 10),
    });
  }

  async verifyUserLogin(email: string, password: string) {
    const user = await this.usersService.getUserByEmail(email).catch(() => {
      throw new UnauthorizedException('User not found by the provided email address');
    });

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
    return user;
  }
}
