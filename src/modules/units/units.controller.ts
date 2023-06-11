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
import { ConvertParamToObjectId } from 'src/decorators/convert-to-objectId.decorator';

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
  findOne(@Param('_id') _id: string) {
    return this.unitsService.findOne(_id);
  }

  @Patch(':_id')
  update(@Param('_id') _id: string, @Body() updateUnitDto: UpdateUnitDto) {
    return this.unitsService.update(_id, updateUnitDto);
  }

  @Delete(':_id')
  remove(@Param('_id') _id: string) {
    return this.unitsService.remove(_id);
  }
}
