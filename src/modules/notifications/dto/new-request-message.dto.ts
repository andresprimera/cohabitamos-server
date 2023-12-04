import { REQUIREMENT_STATE } from 'src/common/enums';

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
