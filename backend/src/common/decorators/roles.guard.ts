import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { ROLES_KEY } from "../guard/roles.decorator";
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }
    canActivate(context: ExecutionContext): boolean {
        const required = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ])
        const req = context.switchToHttp().getRequest();
        if (!required || required.length === 0) return true;
        const user = req.user;
        if (!user) throw new ForbiddenException('No user on request (JwtGuard not run or failed)');

        const raw = Array.isArray(user.roles) ? user.roles : (user.role ? [user.role] : []);
        const userRoles = raw.map((r: string) => String(r).toLowerCase());
        const needed = required.map((r) => r.toLowerCase());

        const ok = needed.some((r) => userRoles.includes(r));
        if (!ok) throw new ForbiddenException('Insufficient role');
        return true;
    }

}