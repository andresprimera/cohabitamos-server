import { Module } from '@nestjs/common';
import { SuggestionsService } from './suggestions.service';
import { SuggestionsController } from './suggestions.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { SuggestionsEntity } from 'src/entities/suggestions.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule, TypegooseModule.forFeature([SuggestionsEntity])],
  controllers: [SuggestionsController],
  providers: [SuggestionsService],
})
export class SuggestionsModule {}
