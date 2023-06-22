import { prop } from '@typegoose/typegoose';
import { REQUIREMENT_STATE } from 'src/common/enums';

class Metadata {
  @prop({})
  limit: number;

  @prop({})
  page: number;
}

export class RequirementFiltersDto {
  @prop({ enum: REQUIREMENT_STATE })
  status?: string;
  metadata: Metadata;
}
