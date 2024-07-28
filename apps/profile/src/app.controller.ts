import { Controller, Request, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from '@app/common';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile/me')
  getCurrentUserProfile(@Request() req) {
    const user = { ...req.user };
    delete user.password;
    return user;
  }
}
