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
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { ConvertParamToObjectId } from 'src/decorators/convert-to-objectId.decorator';
import { CondominiumInterceptor } from 'src/interceptors/captureCondominium.interceptor';
import { Types } from 'mongoose';

@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  create(
    @ConvertParamToObjectId(['unit', 'condominium']) createPetDto: CreatePetDto,
  ) {
    return this.petsService.create(createPetDto);
  }

  @UseInterceptors(CondominiumInterceptor)
  @Get()
  findAll(@Param('requestCondominium') requestCondominium: Types.ObjectId) {
    return this.petsService.findAll(requestCondominium);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.petsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePetDto: UpdatePetDto) {
    return this.petsService.update(+id, updatePetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.petsService.remove(+id);
  }
}
