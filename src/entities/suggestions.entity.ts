import { modelOptions, mongoose, prop, Ref } from '@typegoose/typegoose';
import { ShortUserEntity } from './user.entity';

@modelOptions({
  schemaOptions: { collection: 'suggestions', timestamps: true },
})
export class SuggestionsEntity {
  _id: mongoose.Types.ObjectId;

  @prop({ required: true })
  message: string;

  @prop()
  imagesUrl: string[];

  @prop({ ref: () => ShortUserEntity })
  author: ShortUserEntity;
}
