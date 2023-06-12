import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UnitsService } from './units.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import {
  ConvertParamToObjectId,
  ConvertToObjectId,
} from 'src/decorators/convert-to-objectId.decorator';
import { Types } from 'mongoose';

@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Post()
  create(
    @ConvertParamToObjectId(['condominium']) createUnitDto: CreateUnitDto,
  ) {
    return this.unitsService.create(createUnitDto);
  }

  @Get(':_id')
  findOne(@ConvertToObjectId() _id: Types.ObjectId) {
    return this.unitsService.findOne(_id);
  }

  @Patch(':_id')
  update(
    @ConvertToObjectId() _id: Types.ObjectId,
    @Body() updateUnitDto: UpdateUnitDto,
  ) {
    return this.unitsService.update(_id, updateUnitDto);
  }

  @Delete(':_id')
  remove(@ConvertToObjectId() _id: Types.ObjectId) {
    return this.unitsService.remove(_id);
  }
}
