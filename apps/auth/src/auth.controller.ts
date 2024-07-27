import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './users/dto/login-user.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getRoot(): { message: string; status: string } {
    return this.authService.getHello();
  }

  @Post('auth/register')
  registerUser(@Body() createUser: CreateUserDto) {
    return this.authService.registerUser(createUser);
  }

  @Get('auth/login')
  loginUser(@Body() loginUser: LoginUserDto) {
    return this.authService.loginUser(loginUser);
  }
}
