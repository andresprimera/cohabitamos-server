import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GuestReportsService } from './guest-reports.service';
import { CreateGuestReportDto } from './dto/create-guest-report.dto';
import { UpdateGuestReportDto } from './dto/update-guest-report.dto';

@Controller('guest-reports')
export class GuestReportsController {
  constructor(private readonly guestReportsService: GuestReportsService) {}

  @Post()
  create(@Body() createGuestReportDto: CreateGuestReportDto) {
    return this.guestReportsService.create(createGuestReportDto);
  }

  @Get()
  findAll() {
    return this.guestReportsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.guestReportsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGuestReportDto: UpdateGuestReportDto,
  ) {
    return this.guestReportsService.update(+id, updateGuestReportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.guestReportsService.remove(+id);
  }
}
