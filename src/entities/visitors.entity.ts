import { modelOptions, prop, Ref } from '@typegoose/typegoose';
import { UnitEntity } from './unit.entity';
import { GuestReportEntity } from './guest-report.entity';
import { DOC_TYPE, VISITORS_CONDITION } from 'src/common/enums';
import { CondominiumEntity } from './condominium.entity';
import { Types } from 'mongoose';
import { Visitor } from 'src/common/dtos/create-visitor.dto';

@modelOptions({
  schemaOptions: { collection: 'visitors', timestamps: true },
})
export class VisitorsEntity {
  @prop({ ref: () => GuestReportEntity })
  guestReportId: Ref<GuestReportEntity>;

  @prop({})
  firstName: string;

  @prop({})
  lastName: string;

  @prop({})
  email: string;

  @prop({})
  phone?: string;

  @prop({})
  whatsapp?: string;

  @prop({})
  nationality?: string;

  @prop({ enum: DOC_TYPE })
  docType?: string;

  @prop({})
  docNumber?: string;

  @prop({ enum: VISITORS_CONDITION, default: VISITORS_CONDITION.MAIN_GUEST })
  condition: string;

  @prop({ ref: () => UnitEntity })
  unit: Ref<UnitEntity>;

  @prop({ ref: () => CondominiumEntity })
  condominium: Ref<CondominiumEntity>;
}
