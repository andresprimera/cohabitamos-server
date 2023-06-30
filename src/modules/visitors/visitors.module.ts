import { Module } from '@nestjs/common';
import { VisitorsService } from './visitors.service';
import { VisitorsController } from './visitors.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { VisitorsEntity } from 'src/entities/visitors.entity';
import { CondominiumsModule } from '../condominiums/condominiums.module';
import { UnitsModule } from '../units/units.module';

@Module({
  imports: [
    CondominiumsModule,
    UnitsModule,
    TypegooseModule.forFeature([VisitorsEntity]),
  ],
  controllers: [VisitorsController],
  providers: [VisitorsService],
})
export class VisitorsModule {}
