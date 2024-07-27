import { Body, Request, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

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

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.loginUser(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
