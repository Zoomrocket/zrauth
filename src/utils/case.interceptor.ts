import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as lodash from 'lodash';
import { Response } from 'express';
import { MaskMan } from 'maskman.js';

@Injectable()
export class SnakeCaseInterceptor implements NestInterceptor {
  private snakeCaseConverter(json: any) {
    json = MaskMan.convert(JSON.parse(JSON.stringify(json))).to(
      lodash.snakeCase,
    );
    return json;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap((data) => {
        const response: Response = context.switchToHttp().getResponse();
        response.json(this.snakeCaseConverter(data));
        return;
      }),
    );
  }
}
