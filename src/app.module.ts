import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
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
import { authMiddleware } from './middlewares/auth.middleware';
import { RequirementsLogModule } from './modules/requirements-log/requirements-log.module';
import { Firebase } from './providers/firebase';
import { VisitorsModule } from './modules/visitors/visitors.module';
import { UserRegistrationLinkModule } from './modules/user-registration-link/user-registration-link.module';
import { ChatModule } from './modules/chat/chat.module';
import { OpenAI } from './providers/openAi';
import { NotificationService } from './providers/notifications';

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
    RequirementsLogModule,
    VisitorsModule,
    UserRegistrationLinkModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService, Firebase, OpenAI, NotificationService],
})
// export class AppModule {}
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(authMiddleware)
      .exclude(
        { path: 'users', method: RequestMethod.POST },
        { path: 'condominiums', method: RequestMethod.GET },
        { path: 'condominiums/:_id', method: RequestMethod.GET },
        { path: 'users/get-by-email/:email', method: RequestMethod.GET },
        { path: 'requirements', method: RequestMethod.POST },
        { path: 'requirements/get-by-user/:email', method: RequestMethod.GET },
        { path: 'requirement-types', method: RequestMethod.GET },
        { path: 'requirements-logs/:_id', method: RequestMethod.GET },
        { path: 'requirements-logs', method: RequestMethod.POST },
        { path: 'guest-reports', method: RequestMethod.POST },
        { path: 'guest-reports', method: RequestMethod.GET },
        { path: 'options', method: RequestMethod.GET },
        { path: 'pets/get-by-name/name', method: RequestMethod.GET },
        { path: 'vehicles/get-by-plate/plate', method: RequestMethod.GET },
        { path: 'user-registration-link/:_id', method: RequestMethod.GET },
        { path: 'chat', method: RequestMethod.POST },
        { path: 'visitors/:docNumber', method: RequestMethod.GET },
        { path: 'user-registration-link', method: RequestMethod.POST },
        { path: 'users-by-unit', method: RequestMethod.POST },
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
