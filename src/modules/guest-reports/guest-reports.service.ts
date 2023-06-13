import { Injectable } from '@nestjs/common';
import { CreateGuestReportDto } from './dto/create-guest-report.dto';
import { UpdateGuestReportDto } from './dto/update-guest-report.dto';

@Injectable()
export class GuestReportsService {
  create(createGuestReportDto: CreateGuestReportDto) {
    return 'This action adds a new guestReport';
  }

  findAll() {
    return `This action returns all guestReports`;
  }

  findOne(id: number) {
    return `This action returns a #${id} guestReport`;
  }

  update(id: number, updateGuestReportDto: UpdateGuestReportDto) {
    return `This action updates a #${id} guestReport`;
  }

  remove(id: number) {
    return `This action removes a #${id} guestReport`;
  }
}
