import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptions } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

export type GoogleProfile = {
  provider: 'google';
  providerId: string;
  email: string | null;
  name: string | null;
  avatar: string | null;
  googleAccessToken?: string; // 👈 thêm để backend có thể dùng gọi API Google
};

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(cfg: ConfigService) {
    super({
      clientID: cfg.get<string>('GOOGLE_CLIENT_ID')!,
      clientSecret: cfg.get<string>('GOOGLE_CLIENT_SECRET')!,
      callbackURL: cfg.get<string>('GOOGLE_CALLBACK_URL')!,
      scope: ['email', 'profile'],
    } as StrategyOptions);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<GoogleProfile> {
    const { id, emails, displayName, photos } = profile;

    return {
      provider: 'google',
      providerId: id,
      email: emails?.[0]?.value ?? null,
      name: displayName ?? null,
      avatar: photos?.[0]?.value ?? null,
      googleAccessToken: accessToken, // 👈 giữ lại accessToken của Google
    };
  }
}
