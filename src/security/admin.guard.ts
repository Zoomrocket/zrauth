import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { keys } from 'src/keys';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const response = context.switchToHttp().getResponse();
      let token = request.headers['authorization'].split(' ')[1];
      if (token === keys.ADMIN_KEY) {
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  }
}
