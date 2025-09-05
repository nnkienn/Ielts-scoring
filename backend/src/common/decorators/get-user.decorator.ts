import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Lấy payload đã được JwtGuard gắn vào request.user
 *
 * Cách dùng:
 *  - @GetUser()            -> trả về toàn bộ req.user
 *  - @GetUser('sub')       -> trả về req.user.sub
 *  - @GetUser('email')     -> trả về req.user.email
 */
export const GetUser = createParamDecorator(
  (data: keyof any | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    // Khi route dùng @Public() hoặc chưa qua JwtGuard -> user có thể undefined
    if (!user) return undefined;
    return data ? user?.[data] : user;
  },
);
