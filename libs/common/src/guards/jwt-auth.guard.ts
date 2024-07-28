import { CanActivate, ExecutionContext, Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { AUTH_SERVICE } from '../constants/services';
import { User } from '../interfaces/user.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const token = context.switchToHttp().getRequest().headers?.authorization;
    if (!token) {
      return false;
    }

    return this.authClient
      .send<User>('authenticate', {
        authorization: token,
      })
      .pipe(
        tap((res) => {
          context.switchToHttp().getRequest().user = res;
        }),
        map(() => true),
        catchError(() => {
          this.logger.warn('Unable to authorize from provided JWT token');
          return of(false);
        }),
      );
  }
}
