import { Injectable, InternalServerErrorException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { CreateUserDto } from './users/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  getHello(): { message: string; status: string } {
    return {
      message: 'Welcome to auth service',
      status: 'success',
    };
  }

  async registerUser(createUser: CreateUserDto) {
    let userExists = null;
    try {
      userExists = await this.usersService.getUserByEmail(createUser.email);
    } catch (error) {
      // We generally get an error here when the user doesn't exist
      // so we can continue to create the user
    }

    if (userExists) {
      throw new UnprocessableEntityException('Email already exists.');
    }

    try {
      const createdUser = this.usersService.create({
        ...createUser,
        password: await bcrypt.hash(createUser.password, 10),
      });

      this.amqpConnection.publish('auth_exchange', '', { event: 'user_registered', user: { ...createdUser } });

      return createdUser;
    } catch (error) {
      throw new InternalServerErrorException(error, 'Error while creating user.');
    }
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

  async loginUser(user: User) {
    const payload = { userId: user.id };

    this.amqpConnection.publish('auth_exchange', '', { event: 'user_logged_in', user });

    return {
      status: 'success',
      message: 'Login successful',
      access_token: this.jwtService.sign(payload),
    };
  }
}
