import { Module } from '@nestjs/common';
import { CondominiumsService } from './condominiums.service';
import { CondominiumsController } from './condominiums.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { CondominiumEntity } from 'src/entities/condominium.entity';
import { UnitsModule } from '../units/units.module';
import { OptionsModule } from '../options/options.module';
import { RequirementTypesModule } from '../requirement-types/requirement-types.module';
import { UsersModule } from '../users/users.module';
import { AccountsModule } from '../accounts/accounts.module';

@Module({
  imports: [
    UnitsModule,
    OptionsModule,
    RequirementTypesModule,
    UsersModule,
    AccountsModule,
    TypegooseModule.forFeature([CondominiumEntity]),
  ],
  controllers: [CondominiumsController],
  providers: [CondominiumsService],
  exports: [CondominiumsService],
})
export class CondominiumsModule {}
