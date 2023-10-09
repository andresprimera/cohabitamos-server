import { Module } from '@nestjs/common';
import { GuestReportsService } from './guest-reports.service';
import { GuestReportsController } from './guest-reports.controller';
import { UnitsModule } from '../units/units.module';
import { UsersModule } from '../users/users.module';
import { CondominiumsModule } from '../condominiums/condominiums.module';
import { TypegooseModule } from 'nestjs-typegoose';
import { GuestReportEntity } from 'src/entities/guest-report.entity';
import { PetsModule } from '../pets/pets.module';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { UsersByUnitModule } from '../users-by-unit/users-by-unit.module';
import { VisitorsModule } from '../visitors/visitors.module';

@Module({
  imports: [
    UnitsModule,
    UsersModule,
    CondominiumsModule,
    PetsModule,
    VehiclesModule,
    UsersByUnitModule,
    VisitorsModule,
    TypegooseModule.forFeature([GuestReportEntity]),
  ],
  controllers: [GuestReportsController],
  providers: [GuestReportsService],
})
export class GuestReportsModule {}
