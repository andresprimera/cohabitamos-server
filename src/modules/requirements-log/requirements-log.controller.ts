import { Body, Controller, Get, Post } from '@nestjs/common';
import { RequirementsLogService } from './requirements-log.service';
import { CreateRequirementsLogDto } from './dto/create-requirements-log.dto';
import { UpdateRequirementsLogDto } from './dto/update-requirements-log.dto';
import {
  ConvertParamToObjectId,
  ConvertToObjectId,
} from 'src/decorators/convert-to-objectId.decorator';
import { Types } from 'mongoose';
import { RequirementEntity } from 'src/entities/requirement.entity';

@Controller('requirements-logs')
export class RequirementsLogController {
  constructor(
    private readonly requirementsLogService: RequirementsLogService,
  ) {}

  @Post()
  create(
    @Body()
    createRequirementsLogDto: CreateRequirementsLogDto,
  ) {
    return this.requirementsLogService.create(createRequirementsLogDto);
  }

  @Get(':_id')
  findOne(@ConvertToObjectId('_id') _id: Types.ObjectId) {
    return this.requirementsLogService.findByRequirementId(_id);
  }
}
