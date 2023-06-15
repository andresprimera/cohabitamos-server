import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { TypegooseModule } from 'nestjs-typegoose';
import { CondominiumsModule } from './modules/condominiums/condominiums.module';
import { UnitsModule } from './modules/units/units.module';
import { UsersByUnitModule } from './modules/users-by-unit/users-by-unit.module';
import { RequirementsModule } from './modules/requirements/requirements.module';
import { ConfigModule } from '@nestjs/config';
import { RequirementTypesModule } from './modules/requirement-types/requirement-types.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { GuestReportsModule } from './modules/guest-reports/guest-reports.module';
import { PetsModule } from './modules/pets/pets.module';
import { AuthModule } from './modules/auth/auth.module';
import { OptionsModule } from './modules/options/options.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypegooseModule.forRootAsync({
      useFactory: async () => {
        return {
          uri: process.env.MONGO_CONNECTION_URL as string,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        };
      },
    }),
    UsersModule,
    AccountsModule,
    CondominiumsModule,
    UnitsModule,
    UsersByUnitModule,
    RequirementsModule,
    RequirementTypesModule,
    VehiclesModule,
    GuestReportsModule,
    PetsModule,
    AuthModule,
    OptionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
