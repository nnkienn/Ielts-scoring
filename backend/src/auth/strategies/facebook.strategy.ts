import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOption } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';

export type FacebookProfile = {
  provider: 'facebook';
  providerId: string;
  email: string | null;
  name: string | null;
  avatar: string | null;
  facebookAccessToken?: string;
};

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(cfg: ConfigService) {
    super({
      clientID: cfg.get<string>('FB_APP_ID')!,
      clientSecret: cfg.get<string>('FB_APP_SECRET')!,
      callbackURL: cfg.get<string>('FB_CALLBACK_URL')!,
      profileFields: ['id', 'displayName', 'emails', 'photos'],
    } as StrategyOption);
  }

  async validate(accessToken: string, refreshToken: string, profile: any): Promise<FacebookProfile> {
    const { id, emails, displayName, photos } = profile;

    return {
      provider: 'facebook',
      providerId: id,
      email: emails?.[0]?.value ?? null,
      name: displayName ?? null,
      avatar: photos?.[0]?.value ?? null,
      facebookAccessToken: accessToken,
    };
  }
}
