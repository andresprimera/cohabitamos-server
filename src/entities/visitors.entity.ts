import { modelOptions, prop, Ref } from '@typegoose/typegoose';
import { UnitEntity } from './unit.entity';
import { GuestReportEntity } from './guest-report.entity';
import { DOC_TYPE, VISITOR_CONDITION } from 'src/common/enums';
import { CondominiumEntity } from './condominium.entity';
import { Types } from 'mongoose';

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

  @prop({ enum: VISITOR_CONDITION, default: VISITOR_CONDITION.MAIN_GUEST })
  condition: string;

  @prop({ ref: () => UnitEntity })
  unit: Ref<UnitEntity>;

  @prop({ ref: () => CondominiumEntity })
  condominium: Ref<CondominiumEntity>;

  getObject(
    visitor: VisitorsEntity,
    unitId: Types.ObjectId,
    condominiumId: Types.ObjectId,
  ) {
    this.guestReportId = visitor.guestReportId;
    this.firstName = visitor.firstName;
    this.lastName = visitor.lastName;
    this.email = visitor.email;
    this.phone = visitor.phone;
    this.whatsapp = visitor.whatsapp;
    this.nationality = visitor.nationality;
    this.docType = visitor.docType;
    this.docNumber = visitor.docNumber;
    this.condition = visitor.condition;
    this.unit = unitId;
    this.condominium = condominiumId;

    return this;
  }
}
