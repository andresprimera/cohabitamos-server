import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Types } from 'mongoose';

export const ObjectIdParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const _id = request.params._id;
    return new Types.ObjectId(_id);
  },
);
