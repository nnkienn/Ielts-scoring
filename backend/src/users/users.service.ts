import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma } from '@prisma/client';
export type UserWithRole = Prisma.UserGetPayload<{ include: { role: true } }>;

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) { }


  findOne(id: number) {
    return this.prismaService.user.findUnique({ where: { id } });
  }
  findByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email },
      include: { role: true }
    });
  }


  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  removeUser(id: number) {
    return this.prismaService.user.delete({ where: { id } });
  }
}
