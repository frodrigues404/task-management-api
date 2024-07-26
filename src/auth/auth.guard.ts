import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  private jwtSecret: string;
  constructor (
    private readonly jwtService: JwtService, 
    private readonly configService: ConfigService
  ) { this.jwtSecret = this.configService.get<string>('JWT_SECRET'); }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if(!token) {
      throw new UnauthorizedException('Unauthorized');
    }

    try {
      const paylaoad = this.jwtService.verifyAsync(token, {secret: this.jwtSecret});
      request['user'] = paylaoad;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized');
    }
    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
