import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { Observable } from 'rxjs';

@Injectable()
export class CondominiumInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const requestCondominium = request.headers['requestcondominium'];

    if (!requestCondominium)
      throw new BadRequestException('requestcondominium missing from header');

    request.params = {
      ...request.params,
      requestCondominium: new Types.ObjectId(requestCondominium),
    };

    return next.handle();
  }
}
