import { Module } from '@nestjs/common';
import { OpenAI } from 'src/providers/openAi';
import { CondominiumsModule } from '../condominiums/condominiums.module';
import { RequirementTypesModule } from '../requirement-types/requirement-types.module';
import { RequirementsModule } from '../requirements/requirements.module';
import { UsersModule } from '../users/users.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [
    UsersModule,
    RequirementsModule,
    CondominiumsModule,
    RequirementTypesModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, OpenAI],
})
export class ChatModule {}
