import { Types } from 'mongoose';
import { DOCUMENT_TYPES, VISITORS_CONDITION } from '../enums';

export interface Visitor {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  whatsapp: string;
  nationality: string;
  docType: DOCUMENT_TYPES;
  docNumber: string;
  condition: VISITORS_CONDITION;
}

export class CreateVisitorDto {
  visitors: Visitor[];
  unit: Types.ObjectId;
  guestReportId: Types.ObjectId;
}
