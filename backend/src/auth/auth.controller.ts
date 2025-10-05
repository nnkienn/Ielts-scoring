import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import type { Response, Request } from 'express';
import { RegisterDto } from './dto/register-auth.dto';
import { LoginDto } from './dto/login-auth.dto';
import { Public } from 'src/common/guard/public.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService, private cfg: ConfigService) {}

  // ===== Email/password =====
  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto, @Res() res: Response) {
    const out = await this.auth.register(dto);
    // set refresh cookie
    this.auth.setRefreshCookie(res, out.tokens.refreshToken);
    // trả đúng shape FE mong đợi
    return res.json({ user: out.user, accessToken: out.tokens.accessToken });
  }

  @Public()
  @Post('login')
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const out = await this.auth.login(dto);
    this.auth.setRefreshCookie(res, out.tokens.refreshToken);
    // trả đúng shape FE mong đợi
    return res.json({ user: out.user, accessToken: out.tokens.accessToken });
  }

  @Public()
  @Post('refresh')
  async refresh(@Req() req: Request) {
    const rt = req.cookies?.rt;
    if (!rt) throw new UnauthorizedException('No refresh token');
    return this.auth.refreshToken(rt); // { accessToken }
  }

  @Public()
  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('rt', { path: '/' });
    return res.json({ ok: true });
  }

  // ===== Google OAuth =====
  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin(@Query('next') _next?: string) {
    return;
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: Request, @Res() res: Response, @Query('state') state?: string) {
    const profile = (req as any).user;
    const { user, tokens } = await this.auth.socialLoginGoogle(profile);

    this.auth.setRefreshCookie(res, tokens.refreshToken);

    const redirectBase =
      state ?? `${this.cfg.get('FRONTEND_BASE_URL')}/homepage?social=1`;

    const redirectTo = `${decodeURIComponent(redirectBase)}${
      redirectBase.includes('?') ? '&' : '?'
    }accessToken=${tokens.accessToken}`;

    return res.redirect(redirectTo);
  }

  // ===== Facebook OAuth =====
  @Public()
  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin(@Query('next') _next?: string) {
    return;
  }

  @Public()
  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookCallback(@Req() req: Request, @Res() res: Response, @Query('state') state?: string) {
    const profile = (req as any).user;
    const { user, tokens } = await this.auth.socialLoginFacebook(profile);

    this.auth.setRefreshCookie(res, tokens.refreshToken);

    const redirectBase =
      state ?? `${this.cfg.get('FRONTEND_BASE_URL')}/homepage?social=fb`;

    const redirectTo = `${decodeURIComponent(redirectBase)}${
      redirectBase.includes('?') ? '&' : '?'
    }accessToken=${tokens.accessToken}`;

    return res.redirect(redirectTo);
  }
}
