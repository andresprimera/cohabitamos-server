import { Types } from 'mongoose';

export interface Visitor {
  firstName: 'name 1';
  lastName: 'lastname 1';
  email: 'email 1';
  phone: 'visitor.phone';
  whatsapp: 'visitor.whatsapp';
  nationality: 'visitor.nationality';
  docType: 'CÉDULA DE CIUDADANÍA';
  docNumber: 'asdasdasda';
  condition: 'Responsable';
}

export class CreateVisitorDto {
  visitors: Visitor[];
  unit: Types.ObjectId;
  guestReportId: string;
}
