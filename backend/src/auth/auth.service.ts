import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register-auth.dto';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService, UserWithRole } from 'src/users/users.service';
import { Response } from 'express';
import { LoginDto } from './dto/login-auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configservice: ConfigService,
    private userService: UsersService
  ) { }

  public setRefreshCookie(res: Response, refreshToken: string) {
    const isProd =
      (this.configservice.get<string>('NODE_ENV') || process.env.NODE_ENV) === 'production';

    res.cookie('rt', refreshToken, {
      httpOnly: true,
      sameSite: isProd ? ('none' as const) : ('lax' as const),
      secure: isProd,
      path: '/', // 👈 Quan trọng để cookie gửi ở mọi route
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
    return { accessToken, refreshToken }
  }

  async validateUser(loginDto: LoginDto): Promise<UserWithRole> {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) throw new UnauthorizedException("Email not found");
    const isPasswordMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Password invalid');
    }
    return user as UserWithRole;
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync<{ sub: number; email: string }>(
        refreshToken,
        { secret: this.configservice.get<string>('JWT_REFRESH_SECRET') }
      )
      const user = await this.prismaService.user.findUnique({
        where: { id: payload.sub },
        include: { role: true }
      })
      if (!user) throw new UnauthorizedException('User not found');
      const { accessToken } = await this.issueTokens(user as UserWithRole)
      return { accessToken }
    } catch (error) {
      throw new UnauthorizedException('invalid refresh token')
    }
  }

  async register(registerDto: RegisterDto) {
    const { email, password, name, roleId } = registerDto;
    const existingEmail = await this.prismaService.user.findUnique({ where: { email } })
    const hashPassword = await bcrypt.hash(password, 10);

    const user = await this.prismaService.user.create({
      data: { email, password: hashPassword, name, roleId },
      include: { role: true }
    })
    const tokens = await this.issueTokens(user as UserWithRole);
    const { password: _pw, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      backendTokens: tokens
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);
    const tokens = await this.issueTokens(user);
    const { password: _pw, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      backendTokens: tokens
    }
  }


}
