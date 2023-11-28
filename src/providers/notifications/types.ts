import { AUTHORIZATION_STATUS, REQUIREMENT_STATE } from 'src/common/enums';
import { ETemplates } from './enums';

export interface ITemplate {
  name: ETemplates;
  id: string;
}

export interface IGuestReportCreatedPayload {
  condition: string;
  condominiumName: string;
  userEmail: string;
  unitNumber: string;
  unitType: string;
  unitBlock: string;
  name: string;
  guestQty: number;
  guestName: string;
  phone: string;
  docType: string;
  docNumber: string;
  arrivalDate: string;
  departureDate: string;
  hasVehicle: string;
  hasPet: string;
}

export interface INewRequestMessagePayload {
  status: REQUIREMENT_STATE | string;
  condominiumName: string;
  userEmail: string;
  unitNumber: string;
  unitType: string;
  unitBlock: string;
  name: string;
  message: string;
  author: string;
  condominiumId: string;
  dateTime: string;
  requirementType: string;
}

export interface IRequestCreatedUpdatedPayload {
  condominiumName: string;
  userEmail: string;
  unitNumber: string;
  unitType: string;
  unitBlock: string;
  name: string;
  title: string;
  description: string;
  status: REQUIREMENT_STATE;
}

export interface IUnitAuthRequestPayload {
  condition: string;
  condominiumName: string;
  userEmail: string;
  unitNumber: string;
  unitType: string;
  unitBlock: string;
  name: string;
  status: AUTHORIZATION_STATUS;
}
