import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register-auth.dto';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService, UserWithRole } from 'src/users/users.service';
import { Response } from 'express';
import { LoginDto } from './dto/login-auth.dto';
import * as bcrypt from 'bcrypt';
import { GoogleProfile } from './strategies/google.strategy';
import { FacebookProfile } from './strategies/facebook.strategy';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configservice: ConfigService,
    private userService: UsersService
  ) {}

  public setRefreshCookie(res: Response, refreshToken: string) {
    const isProd =
      (this.configservice.get<string>('NODE_ENV') ||
        process.env.NODE_ENV) === 'production';

    res.cookie('rt', refreshToken, {
      httpOnly: true,
      sameSite: isProd ? 'none' : 'lax',
      secure: isProd,
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  private async issueTokens(user: UserWithRole) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role?.name || null,
      name: user.name ?? null,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configservice.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configservice.get<string>('JWT_ACCESS_EXPIRES_IN'),
    });

    const refreshToken = await this.jwtService.signAsync(
      { sub: user.id, email: user.email },
      {
        secret: this.configservice.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configservice.get<string>('JWT_REFRESH_EXPIRES_IN'),
      },
    );
    return { accessToken, refreshToken };
  }

  async validateUser(loginDto: LoginDto): Promise<UserWithRole> {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) throw new UnauthorizedException('Email not found');
    const isPasswordMatch = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Password invalid');
    }
    return user as UserWithRole;
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync<{
        sub: number;
        email: string;
      }>(refreshToken, {
        secret: this.configservice.get<string>('JWT_REFRESH_SECRET'),
      });
      const user = await this.prismaService.user.findUnique({
        where: { id: payload.sub },
        include: { role: true },
      });
      if (!user) throw new UnauthorizedException('User not found');
      const { accessToken } = await this.issueTokens(user as UserWithRole);
      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('invalid refresh token');
    }
  }

  async register(registerDto: RegisterDto) {
    const { email, password, name, roleId } = registerDto;
    const existingEmail = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (existingEmail) throw new UnauthorizedException('Email already exists');

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await this.prismaService.user.create({
      data: { email, password: hashPassword, name, roleId },
      include: { role: true },
    });
    const tokens = await this.issueTokens(user as UserWithRole);
    const { password: _pw, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      backendTokens: tokens,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);
    const tokens = await this.issueTokens(user);
    const { password: _pw, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      backendTokens: tokens,
    };
  }

 async changePassword(userId: number, dto: ChangePasswordDto) {
  // 1. Tìm user theo id
  const user = await this.prismaService.user.findUnique({ where: { id: userId } });
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


  async socialLoginGoogle(profile: GoogleProfile): Promise<{
    user: UserWithRole;
    tokens: { accessToken: string; refreshToken: string };
  }> {
    let user = await this.prismaService.user.findFirst({
      where: { googleId: profile.providerId }, // ✅ sửa đúng tên field
      include: { role: true },
    });

    if (!user && profile.email) {
      const exist = await this.userService.findByEmail(profile.email);
      if (exist) {
        user = await this.prismaService.user.update({
          where: { id: exist.id },
          data: {
            googleId: profile.providerId,
            avatar: profile.avatar ?? exist.avatar,
          },
          include: { role: true },
        });
      }
      if (!user) {
        const fallbackEmail =
          profile.email ?? `u_google_${profile.providerId}@example.local`;
        const dummyPass = await bcrypt.hash(
          'oauth_' + profile.providerId,
          10,
        );

        user = await this.prismaService.user.create({
          data: {
            email: fallbackEmail,
            password: dummyPass,
            name: profile.name,
            avatar: profile.avatar,
            roleId: 2,
            googleId: profile.providerId, // ✅ sửa đúng tên field
          },
          include: { role: true },
        });
      }
    }

    if (!user) throw new UnauthorizedException('Google login failed');

    const tokens = await this.issueTokens(user as UserWithRole);
    return { user, tokens };
  }

  async socialLoginFacebook(profile: FacebookProfile): Promise<{
    user: UserWithRole;
    tokens: { accessToken: string; refreshToken: string };
  }> {
    let user = await this.prismaService.user.findFirst({
      where: { facebookId: profile.providerId },
      include: { role: true },
    });

    if (!user && profile.email) {
      const exist = await this.userService.findByEmail(profile.email);
      if (exist) {
        user = await this.prismaService.user.update({
          where: { id: exist.id },
          data: {
            facebookId: profile.providerId,
            avatar: profile.avatar ?? exist.avatar,
          },
          include: { role: true },
        });
      }
      if (!user) {
        const fallbackEmail =
          profile.email ?? `u_fb_${profile.providerId}@example.local`;
        const dummyPass = await bcrypt.hash(
          'oauth_' + profile.providerId,
          10,
        );

        user = await this.prismaService.user.create({
          data: {
            email: fallbackEmail,
            password: dummyPass,
            name: profile.name,
            avatar: profile.avatar,
            roleId: 2,
            facebookId: profile.providerId,
          },
          include: { role: true },
        });
      }
    }

    if (!user) throw new UnauthorizedException('Facebook login failed');

    const tokens = await this.issueTokens(user as UserWithRole);
    return { user, tokens };
  }
}
