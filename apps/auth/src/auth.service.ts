import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { CreateUserDto } from './users/dto/create-user.dto';
import { LoginUserDto } from './users/dto/login-user.dto';

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
    return this.usersService.create(createUser);
  }

  async loginUser(loginUser: LoginUserDto) {
    // TODO: implement login authentication via JWT
    return this.usersService.verifyUser(loginUser.email, loginUser.password);
  }
}
