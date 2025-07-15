import { LoggerService } from '@app/common';
import { PrismaService } from '@app/prisma';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly primsaService: PrismaService, private loggerService: LoggerService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const isUserExist = this.primsaService.user.findUnique({
      where: {
        id: payload.sub,
      },
    });

    if (!isUserExist) {
      this.loggerService.warn('User does not exists!')
      throw new UnauthorizedException('User does not exist!');
    }

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
