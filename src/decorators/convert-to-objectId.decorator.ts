import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
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

    try {
      return new Types.ObjectId(request.params._id);
    } catch (error) {
      Logger.error(`${request.url}: invalid _id`);
      throw new BadRequestException(`Invalid _id`);
    }
  },
);

export const ConvertParamToObjectId = createParamDecorator(
  (data: string[], ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const params = request.body;

    Object.keys(params).forEach((key) => {
      try {
        if (data.includes(key)) params[key] = new Types.ObjectId(params[key]);
      } catch (error) {
        Logger.error(`${request.url}: ${params[key]} invalid _id`);
        throw new BadRequestException(`${params[key]}: Invalid _id`);
      }
    });

    return params;
  },
);
