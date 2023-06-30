import { Types } from 'mongoose';
import { VisitorsEntity } from 'src/entities/visitors.entity';

export class CreateVisitorDto {
  visitors: VisitorsEntity[];
  unit: Types.ObjectId;
  ghestReportId: string;
}
