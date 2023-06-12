import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { VehiclesEntity } from 'src/entities/vehicle.entity';

@Module({
  imports: [TypegooseModule.forFeature([VehiclesEntity])],
  controllers: [VehiclesController],
  providers: [VehiclesService],
})
export class VehiclesModule {}
