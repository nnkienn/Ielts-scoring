import {
  Body, Controller, Get, Post, Query, Res, Req, UseGuards, UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import type { Response, Request } from 'express';
import { RegisterDto } from './dto/register-auth.dto';
import { LoginDto } from './dto/login-auth.dto';
import { Public } from 'src/common/guard/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService, private cfg: ConfigService) {}

  // Email/password
  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto, @Res() res: Response) {
    const out = await this.auth.register(dto);
    this.auth.setRefreshCookie(res, out.backendTokens.refreshToken);
    return res.json(out);
  }

  @Public()
  @Post('login')
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const out = await this.auth.login(dto);
    this.auth.setRefreshCookie(res, out.backendTokens.refreshToken);
    return res.json(out);
  }

  // ✅ REFRESH ACCESS TOKEN từ cookie `rt`
  @Public()
  @Post('refresh')
  async refresh(@Req() req: Request) {
    const rt = req.cookies?.rt;
    if (!rt) throw new UnauthorizedException('No refresh token');
    return this.auth.refreshToken(rt); // { accessToken }
  }

  // Logout (xóa cookie)
  @Public()
  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('rt', { path: '/' });
    return res.json({ ok: true });
  }


}
