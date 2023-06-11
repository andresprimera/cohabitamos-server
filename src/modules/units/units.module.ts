import { Module } from '@nestjs/common';
import { UnitsService } from './units.service';
import { UnitsController } from './units.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { UnitEntity } from 'src/entities/unit.entity';

@Module({
  imports: [TypegooseModule.forFeature([UnitEntity])],
  controllers: [UnitsController],
  providers: [UnitsService],
})
export class UnitsModule {}
