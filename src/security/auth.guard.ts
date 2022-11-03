import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from "jsonwebtoken";
import { keys } from 'src/keys';

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const request = context.switchToHttp().getRequest();
            const response = context.switchToHttp().getResponse();
            let token = request.headers["authorization"].split(" ")[1];
            let decoded = jwt.verify(token, keys.ACCESS_SECRET);
            response.locals.user = decoded;
            return true;
        } catch (err) {
            return false;
        }
    }
}
