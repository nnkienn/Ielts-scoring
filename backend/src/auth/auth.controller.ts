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
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtGuard } from 'src/common/decorators/jwt.guard';
import { GetUser } from 'src/common/guard/get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService, private cfg: ConfigService) { }

  // ===== Email/password =====
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
  @UseGuards(JwtGuard)
  @Post('change-password')
  async changePassword(
    @GetUser('sub') userId: number,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.auth.changePassword(userId, dto);
  }

  // ===== Google OAuth =====
  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin(@Query('next') next?: string) {
    // Guard sẽ tự redirect sang Google
    // param "next" sẽ được truyền trong state
    return;
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(
    @Req() req: Request,
    @Res() res: Response,
    @Query('state') state?: string,
  ) {
    const profile = (req as any).user;
    const { user, tokens } = await this.auth.socialLoginGoogle(profile);

    // Set refreshToken vào cookie httpOnly
    this.auth.setRefreshCookie(res, tokens.refreshToken);

    // Trả accessToken về FE qua query string
    const redirectBase =
      state ?? `${this.cfg.get('FRONTEND_BASE_URL')}/homepage?social=1`;

    const redirectTo = `${decodeURIComponent(redirectBase)}${redirectBase.includes('?') ? '&' : '?'
      }accessToken=${tokens.accessToken}`;

    return res.redirect(redirectTo);
  }

  // ==== Facebook OAuth ====
  @Public()
  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin(@Query('next') next?: string) {
    // Guard sẽ tự redirect sang Facebook
    return;
  }

  @Public()
  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookCallback(
    @Req() req: Request,
    @Res() res: Response,
    @Query('state') state?: string,
  ) {
    const profile = (req as any).user;
    const { user, tokens } = await this.auth.socialLoginFacebook(profile);

    this.auth.setRefreshCookie(res, tokens.refreshToken);

    // Trả accessToken về FE
    const redirectBase =
      state ?? `${this.cfg.get('FRONTEND_BASE_URL')}/homepage?social=fb`;

    const redirectTo = `${decodeURIComponent(redirectBase)}${redirectBase.includes('?') ? '&' : '?'
      }accessToken=${tokens.accessToken}`;

    return res.redirect(redirectTo);
  }

}
