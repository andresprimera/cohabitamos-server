import { Types } from 'mongoose';
import { DOC_TYPE, VISITORS_CONDITION } from '../enums';

export interface Visitor {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  whatsapp: string;
  nationality: string;
  docType: DOC_TYPE;
  docNumber: string;
  condition: VISITORS_CONDITION;
}

export class CreateVisitorDto {
  visitors: Visitor[];
  unit: Types.ObjectId;
  guestReportId: Types.ObjectId;
}
