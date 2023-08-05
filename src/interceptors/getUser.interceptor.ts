import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ChildProcess } from 'child_process';
import { Types } from 'mongoose';
import { Observable } from 'rxjs';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class GetUserInterceptor implements NestInterceptor {
  constructor(private readonly userRepository: UsersService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const operator = request.headers['operator'];

    if (!operator)
      throw new BadRequestException('Operator missing from header');

    const user = await this.userRepository
      .findOne(new Types.ObjectId(operator))
      .catch((error) => {
        Logger.error(error);
        return error;
      });

    request.params = {
      ...request.params,
      operator: user,
    };

    return next.handle();
  }
}
