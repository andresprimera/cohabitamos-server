import { Logger, Module } from '@nestjs/common';
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
import configuration from './config';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration] }),
    TypegooseModule.forRootAsync({
      useFactory: async () => {
        Logger.log(
          'This is the connection for the database string =>',
          process.env.MONGO_CONNECTION_URL,
        );

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
