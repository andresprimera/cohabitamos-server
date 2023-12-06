import { BadRequestException, Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { SuggestionsEntity } from 'src/entities/suggestions.entity';
import { UserEntity } from 'src/entities/user.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateSuggestionDto } from './dto/create-suggestion.dto';

@Injectable()
export class SuggestionsService {
  constructor(
    @InjectModel(SuggestionsEntity)
    private readonly suggestionsRepository: ReturnModelType<
      typeof SuggestionsEntity
    >,
    private readonly notificationService: NotificationsService,
  ) {}

  async create(createSuggestionDto: CreateSuggestionDto, operator: UserEntity) {
    return await this.suggestionsRepository
      .create({
        ...createSuggestionDto,
        author: operator,
      })
      .catch((error) => {
        throw new BadRequestException(error.message);
      })
      .finally(() => {
        this.notificationService.sendEmailToAdmins({
          message: createSuggestionDto.message,
          authorName: `${operator.firstName} ${operator.lastName}`,
          authorEmail: operator.email,
          authorPhone: operator.phone[0],
        });
      });
  }

  async findAll() {
    return await this.suggestionsRepository.find().catch((error) => {
      throw new BadRequestException(error.message);
    });
  }

  async findOne(_id: string) {
    return await this.suggestionsRepository.findById(_id).catch((error) => {
      throw new BadRequestException(error.message);
    });
  }

  async remove(_id: string) {
    return await this.suggestionsRepository
      .findByIdAndDelete(_id)
      .catch((error) => {
        throw new BadRequestException(error.message);
      });
  }
}
