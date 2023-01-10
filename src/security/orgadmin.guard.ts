import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { keys } from 'src/keys';

@Injectable()
export class OrganizationAdminGuard implements CanActivate {
  constructor() {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      let token = request.headers['authorization'].split(' ')[1];
      let decoded = jwt.decode(token);

      const organization_user = decoded['organizations'].find(
        (o) => o.organization_id === request.params.oid,
      );

      if (organization_user.is_admin) {
        return true;
      }

      return false;
    } catch (err) {
      return false;
    }
  }
}
