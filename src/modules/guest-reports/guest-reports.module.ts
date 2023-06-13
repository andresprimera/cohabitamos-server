import { Module } from '@nestjs/common';
import { GuestReportsService } from './guest-reports.service';
import { GuestReportsController } from './guest-reports.controller';

@Module({
  controllers: [GuestReportsController],
  providers: [GuestReportsService]
})
export class GuestReportsModule {}
