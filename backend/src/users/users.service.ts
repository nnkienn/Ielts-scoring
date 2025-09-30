import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export type UserWithRole = Prisma.UserGetPayload<{ include: { role: true } }>;

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  // ✅ Lấy user theo id
  findOne(id: number) {
    return this.prismaService.user.findUnique({
      where: { id },
      include: { role: true }, // nếu cần lấy cả role
    });
  }

  // ✅ Lấy user theo email
  findByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email },
      include: { role: true },
    });
  }

  // ✅ Đổi mật khẩu
  async changePassword(userId: number, dto: ChangePasswordDto) {
    // 1. Tìm user theo id
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new UnauthorizedException('User not found');

    // 2. Check password cũ
    const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Old password is incorrect');
    }

    // 3. Hash mật khẩu mới
    const hashed = await bcrypt.hash(dto.newPassword, 10);

    // 4. Cập nhật DB
    await this.prismaService.user.update({
      where: { id: userId },
      data: { password: hashed },
    });

    return { message: 'Password updated successfully' };
  }

  // ✅ Update thông tin user
  async update(id: number, updateUserDto: UpdateUserDto) {
    // Kiểm tra user có tồn tại không
    const existing = await this.prismaService.user.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // Update
    return this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  // ✅ Xoá user
  removeUser(id: number) {
    return this.prismaService.user.delete({ where: { id } });
  }
}
