import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './shared/decorators/public.decorator';
import { AUTH_TYPE_KEY } from './shared/decorators/auth-type.decorator';

@Injectable()
export class GlobalJwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Allow routes marked with @Public()
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid or missing token');
    }

    // Apply role-based access control if @AuthType() is set
    const requiredRole = this.reflector.getAllAndOverride<string>(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (requiredRole && user.role !== requiredRole) {
      throw new UnauthorizedException(
        `Access denied. Requires role: ${requiredRole}`,
      );
    }

    console.log("user", user)

    return user;
  }
}
