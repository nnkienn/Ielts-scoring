import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AiSecretGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const secret = request.headers['x-ai-secret'];

    if (!secret || secret !== process.env.AI_SERVICE_SECRET) {
      throw new UnauthorizedException('Invalid AI secret');
    }
    return true;
  }
}
