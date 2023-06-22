import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { RequirementsService } from './requirements.service';
import { CreateRequirementDto } from './dto/create-requirement.dto';
import { UpdateRequirementDto } from './dto/update-requirement.dto';
import { ConvertToObjectId } from 'src/decorators/convert-to-objectId.decorator';
import { Types } from 'mongoose';
import { CondominiumInterceptor } from 'src/interceptors/captureCondominium.interceptor';
import { RequirementFiltersDto } from './dto/requirement-filter.dto';

@Controller('requirements')
export class RequirementsController {
  constructor(private readonly requirementsService: RequirementsService) {}

  @Post()
  create(@Body() createRequirementDto: CreateRequirementDto) {
    return this.requirementsService.create(createRequirementDto);
  }

  @UseInterceptors(CondominiumInterceptor)
  @Post('find-all')
  findAll(
    @Param('requestCondominium') requestCondominium: Types.ObjectId,
    @Body() requirementFiltersDto: RequirementFiltersDto,
  ) {
    return this.requirementsService.findAll(
      requestCondominium,
      requirementFiltersDto,
    );
  }

  @Get(':_id')
  findOne(@ConvertToObjectId() _id: Types.ObjectId) {
    return this.requirementsService.findOne(_id);
  }

  @Patch(':_id')
  update(
    @ConvertToObjectId() _id: Types.ObjectId,
    @Body() updateRequirementDto: UpdateRequirementDto,
  ) {
    return this.requirementsService.update(_id, updateRequirementDto);
  }

  @Delete(':_id')
  remove(@ConvertToObjectId() _id: Types.ObjectId) {
    return this.requirementsService.remove(_id);
  }
}
