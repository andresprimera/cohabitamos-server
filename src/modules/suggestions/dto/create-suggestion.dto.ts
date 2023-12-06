import { ShortUserEntity } from 'src/entities/user.entity';

export class CreateSuggestionDto {
  message: string;
  imagesUrl: string[];
  author: ShortUserEntity;
}
