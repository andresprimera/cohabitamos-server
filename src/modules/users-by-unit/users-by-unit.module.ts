import { Module } from '@nestjs/common';
import { UsersByUnitService } from './users-by-unit.service';
import { UsersByUnitController } from './users-by-unit.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { UsersByUnitEntity } from 'src/entities/users-by-unit.entity';
import { UnitsModule } from '../units/units.module';
import { CondominiumsModule } from '../condominiums/condominiums.module';

@Module({
  imports: [
    UnitsModule,
    CondominiumsModule,
    TypegooseModule.forFeature([UsersByUnitEntity]),
  ],
  controllers: [UsersByUnitController],
  providers: [UsersByUnitService],
  exports: [UsersByUnitService],
})
export class UsersByUnitModule {}
