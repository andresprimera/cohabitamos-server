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
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from '../../common/dtos/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import {
  ConvertParamToObjectId,
  ConvertToObjectId,
} from 'src/decorators/convert-to-objectId.decorator';
import { Types } from 'mongoose';
import { CondominiumInterceptor } from 'src/interceptors/captureCondominium.interceptor';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  create(
    @ConvertParamToObjectId(['unit', 'condominium'])
    createVehicleDto: CreateVehicleDto,
  ) {
    return this.vehiclesService.create(createVehicleDto);
  }

  @UseInterceptors(CondominiumInterceptor)
  @Get()
  findAll(@Param('requestCondominium') requestCondominium: Types.ObjectId) {
    return this.vehiclesService.findAll(requestCondominium);
  }

  @Get(':_id')
  findOne(@ConvertToObjectId() id: Types.ObjectId) {
    return this.vehiclesService.findOne(id);
  }

  @Patch(':_id')
  update(
    @ConvertToObjectId() id: Types.ObjectId,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ) {
    return this.vehiclesService.update(id, updateVehicleDto);
  }

  @Delete(':_id')
  remove(@ConvertToObjectId() id: Types.ObjectId) {
    return this.vehiclesService.remove(id);
  }
}
