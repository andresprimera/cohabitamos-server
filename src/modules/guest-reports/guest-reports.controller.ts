import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { GuestReportsService } from './guest-reports.service';
import { CreateGuestReportDto } from './dto/create-guest-report.dto';
import { UpdateGuestReportDto } from './dto/update-guest-report.dto';
import { CondominiumInterceptor } from 'src/interceptors/captureCondominium.interceptor';
import { Types } from 'mongoose';
import { ConvertToObjectId } from 'src/decorators/convert-to-objectId.decorator';

@Controller('guest-reports')
export class GuestReportsController {
  constructor(private readonly guestReportsService: GuestReportsService) {}

  @Post()
  create(@Body() createGuestReportDto: CreateGuestReportDto) {
    return this.guestReportsService.create(createGuestReportDto);
  }

  @UseInterceptors(CondominiumInterceptor)
  @Get()
  findAll(@Param('requestCondominium') requestCondominium: Types.ObjectId) {
    return this.guestReportsService.findAll(requestCondominium);
  }

  @Get(':_id')
  findOne(@ConvertToObjectId() _id: Types.ObjectId) {
    return this.guestReportsService.findOne(_id);
  }

  @Patch(':_id')
  update(
    @ConvertToObjectId() _id: Types.ObjectId,
    @Body() updateGuestReportDto: UpdateGuestReportDto,
  ) {
    return this.guestReportsService.update(_id, updateGuestReportDto);
  }

  @Delete(':_id')
  remove(@ConvertToObjectId() _id: Types.ObjectId) {
    return this.guestReportsService.remove(_id);
  }
}
