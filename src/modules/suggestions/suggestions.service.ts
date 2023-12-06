import { BadRequestException, Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { SuggestionsEntity } from 'src/entities/suggestions.entity';
import { UserEntity } from 'src/entities/user.entity';
import { CreateSuggestionDto } from './dto/create-suggestion.dto';

@Injectable()
export class SuggestionsService {
  constructor(
    @InjectModel(SuggestionsEntity)
    private readonly suggestionsRepository: ReturnModelType<
      typeof SuggestionsEntity
    >,
  ) {}

  async create(createSuggestionDto: CreateSuggestionDto, operator: UserEntity) {
    return await this.suggestionsRepository
      .create({
        ...createSuggestionDto,
        author: operator,
      })
      .catch((error) => {
        throw new BadRequestException(error.message);
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
