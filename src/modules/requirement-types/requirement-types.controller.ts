import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { RequirementTypesService } from './requirement-types.service';
import { CreateRequirementTypeDto } from './dto/create-requirement-type.dto';
import { UpdateRequirementTypeDto } from './dto/update-requirement-type.dto';
import {
  ConvertParamToObjectId,
  ConvertToObjectId,
} from 'src/decorators/convert-to-objectId.decorator';
import { Types } from 'mongoose';
import { CondominiumInterceptor } from 'src/interceptors/captureCondominium.interceptor';

@Controller('requirement-types')
export class RequirementTypesController {
  constructor(
    private readonly requirementTypesService: RequirementTypesService,
  ) {}

  @Post()
  create(
    @ConvertParamToObjectId(['condominium'])
    createRequirementTypeDto: CreateRequirementTypeDto,
  ) {
    return this.requirementTypesService.create(createRequirementTypeDto);
  }

  @UseInterceptors(CondominiumInterceptor)
  @Get()
  findAll(@Param('requestCondominium') requestCondominium: Types.ObjectId) {
    return this.requirementTypesService.findAll(requestCondominium);
  }

  @Get(':_id')
  findOne(@ConvertToObjectId() _id: Types.ObjectId) {
    return this.requirementTypesService.findOne(_id);
  }

  @Delete(':_id')
  remove(@ConvertToObjectId() _id: Types.ObjectId) {
    return this.requirementTypesService.remove(_id);
  }
}
