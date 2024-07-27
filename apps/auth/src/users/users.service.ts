import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return this.prismaService.user.create({
      data: createUserDto,
    });
  }

  async getUserByEmail(email: string) {
    return await this.prismaService.user.findFirstOrThrow({
      where: { email },
    });
  }

  async getUserById(id: string) {
    return await this.prismaService.user.findFirstOrThrow({
      where: { id },
    });
  }
}
