import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    await this.validateIfUserAlreadyRegistered(createUserDto);
    return this.prismaService.user.create({
      data: {
        ...createUserDto,
        password: await bcrypt.hash(createUserDto.password, 10),
      },
    });
  }

  private async validateIfUserAlreadyRegistered(createUserDto: CreateUserDto) {
    try {
      await this.prismaService.user.findFirstOrThrow({
        where: { email: createUserDto.email },
      });
    } catch (err) {
      return;
    }
    throw new UnprocessableEntityException('Email already exists.');
  }

  async verifyUser(email: string, password: string) {
    const user = await this.prismaService.user.findFirstOrThrow({
      where: { email },
    });
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
    return user;
  }
}
