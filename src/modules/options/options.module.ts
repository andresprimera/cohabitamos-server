import { Module } from '@nestjs/common';
import { OptionsService } from './options.service';
import { OptionsController } from './options.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { OptionsEntity } from 'src/entities/options.entity';

@Module({
  imports: [TypegooseModule.forFeature([OptionsEntity])],
  controllers: [OptionsController],
  providers: [OptionsService],
  exports: [OptionsService],
})
export class OptionsModule {}
