import { Module } from '@nestjs/common';
import { CondominiumsService } from './condominiums.service';
import { CondominiumsController } from './condominiums.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { CondominiumEntity } from 'src/entities/condominium.entity';

@Module({
  imports: [TypegooseModule.forFeature([CondominiumEntity])],
  controllers: [CondominiumsController],
  providers: [CondominiumsService],
})
export class CondominiumsModule {}
