import { REQUIREMENT_STATE } from 'src/common/enums';

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
