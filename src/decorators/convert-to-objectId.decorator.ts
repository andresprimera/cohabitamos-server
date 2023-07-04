import { createParamDecorator, ExecutionContext, Logger } from '@nestjs/common';
import { Types } from 'mongoose';

// export const ConvertToObjectId = (paramName: string) =>
//   createParamDecorator((data: unknown, ctx: ExecutionContext) => {
//     const request = ctx.switchToHttp().getRequest();
//     const paramValue = request.params[paramName];
//     return new Types.ObjectId(paramValue);
//   });

export const ConvertToObjectId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return new Types.ObjectId(request.params._id);
  },
);

export const ConvertParamToObjectId = createParamDecorator(
  (data: string[], ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const params = request.body;

    Object.keys(params).forEach((key) => {
      if (data.includes(key)) params[key] = new Types.ObjectId(params[key]);
    });

    return params;
  },
);
