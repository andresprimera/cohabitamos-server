import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CondominiumsService } from './condominiums.service';
import { CreateCondominiumDto } from './dto/create-condominium.dto';
import { UpdateCondominiumDto } from './dto/update-condominium.dto';
import { ConvertParamToObjectId } from 'src/decorators/convert-to-objectId.decorator';

@Controller('condominiums')
export class CondominiumsController {
  constructor(private readonly condominiumsService: CondominiumsService) {}

  @Post()
  create(
    @ConvertParamToObjectId(['account'])
    createCondominiumDto: CreateCondominiumDto,
  ) {
    return this.condominiumsService.create(createCondominiumDto);
  }

  @Get()
  findAll() {
    return this.condominiumsService.findAll();
  }

  @Get(':_id')
  findOne(@Param('_id') _id: string) {
    return this.condominiumsService.findOne(_id);
  }

  @Patch(':_id')
  update(
    @Param('_id') _id: string,
    @Body() updateCondominiumDto: UpdateCondominiumDto,
  ) {
    return this.condominiumsService.update(_id, updateCondominiumDto);
  }

  @Delete(':_id')
  remove(@Param('_id') _id: string) {
    return this.condominiumsService.remove(_id);
  }
}
