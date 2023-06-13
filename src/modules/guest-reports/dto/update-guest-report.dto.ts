import { PartialType } from '@nestjs/mapped-types';
import { CreateGuestReportDto } from './create-guest-report.dto';

export class UpdateGuestReportDto extends PartialType(CreateGuestReportDto) {}
