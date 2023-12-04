import { AUTHORIZATION_STATUS } from 'src/common/enums';

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
