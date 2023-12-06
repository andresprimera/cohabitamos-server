import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { SuggestionsService } from './suggestions.service';
import { CreateSuggestionDto } from './dto/create-suggestion.dto';
import { GetUserInterceptor } from 'src/interceptors/getUser.interceptor';
import { UserEntity } from 'src/entities/user.entity';

@Controller('suggestions')
export class SuggestionsController {
  constructor(private readonly suggestionsService: SuggestionsService) {}

  @UseInterceptors(GetUserInterceptor)
  @Post()
  create(
    @Body() createSuggestionDto: CreateSuggestionDto,
    @Param('operator') operator: UserEntity,
  ) {
    return this.suggestionsService.create(createSuggestionDto, operator);
  }

  @Get()
  findAll() {
    return this.suggestionsService.findAll();
  }

  @Get(':_id')
  findOne(@Param('_id') _id: string) {
    return this.suggestionsService.findOne(_id);
  }

  @Delete(':_id')
  remove(@Param('_id') _id: string) {
    return this.suggestionsService.remove(_id);
  }
}
