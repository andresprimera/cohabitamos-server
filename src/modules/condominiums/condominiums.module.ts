import { Module } from '@nestjs/common';
import { CondominiumsService } from './condominiums.service';
import { CondominiumsController } from './condominiums.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { CondominiumEntity } from 'src/entities/condominium.entity';
import { UnitsModule } from '../units/units.module';

@Module({
  imports: [UnitsModule, TypegooseModule.forFeature([CondominiumEntity])],
  controllers: [CondominiumsController],
  providers: [CondominiumsService],
  exports: [CondominiumsService],
})
export class CondominiumsModule {}
