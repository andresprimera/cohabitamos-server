import { prop } from '@typegoose/typegoose';
import { CreateUserDto } from 'src/common/dtos/create-user.dto';

export class CreateRequirementDto {
  @prop({})
  requirementType: string;

  @prop({})
  description: string;

  @prop({})
  unit: string;

  @prop({ default: 'Abierto' })
  status?: string;

  @prop({ required: true })
  user: CreateUserDto;
}
