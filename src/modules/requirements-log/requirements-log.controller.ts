import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RequirementsLogService } from './requirements-log.service';
import { CreateRequirementsLogDto } from './dto/create-requirements-log.dto';
import { UpdateRequirementsLogDto } from './dto/update-requirements-log.dto';
import {
  ConvertParamToObjectId,
  ConvertToObjectId,
} from 'src/decorators/convert-to-objectId.decorator';
import { Types } from 'mongoose';

@Controller('requirements-logs')
export class RequirementsLogController {
  constructor(
    private readonly requirementsLogService: RequirementsLogService,
  ) {}

  @Post()
  create(
    @ConvertParamToObjectId(['requirementId', 'updatedBy'])
    createRequirementsLogDto: CreateRequirementsLogDto,
  ) {
    return this.requirementsLogService.create(createRequirementsLogDto);
  }

  @Get(':_id')
  findOne(@ConvertToObjectId('_id') _id: Types.ObjectId) {
    return this.requirementsLogService.findByRequirementId(_id);
  }
}
