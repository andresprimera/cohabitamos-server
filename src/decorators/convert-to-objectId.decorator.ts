import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Types } from 'mongoose';

export const ConvertToObjectId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const _id = request.params._id;

    try {
      return new Types.ObjectId(_id);
    } catch (error) {
      const logger = new Logger();
      logger.error(`${request.url}: ${_id} is not a valid ObjectId`);
      throw new BadRequestException(`${_id} is not a valid ObjectId`);
    }
  },
);

export const ConvertParamToObjectId = createParamDecorator(
  (data: string[], ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const params = request.body;

    Object.keys(params).forEach((key) => {
      if (data.includes(key)) {
        try {
          params[key] = new Types.ObjectId(params[key]);
        } catch (error) {
          const logger = new Logger();
          logger.error(`${key} is not a valid ObjectId`);
          throw new BadRequestException(`${key} is not a valid ObjectId`);
        }
      }
    });

    return params;
  },
);
