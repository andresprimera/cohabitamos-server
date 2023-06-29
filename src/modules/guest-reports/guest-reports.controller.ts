import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  BadRequestException,
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
  @Get(':startingDate')
  findAll(
    @Param('requestCondominium') requestCondominium: Types.ObjectId,
    @Param('startingDate') startingDate: string,
  ) {
    const parsedStartingDate = new Date(startingDate);

    if (isNaN(parsedStartingDate.getTime())) {
      throw new BadRequestException('Invalid date format.');
    }

    const adjustedDate = new Date(
      parsedStartingDate.getTime() + 5 * 60 * 60000,
    );

    const endDate = new Date(adjustedDate.getTime() + 27 * 24 * 60 * 60 * 1000);

    return this.guestReportsService.findAll(
      requestCondominium,
      adjustedDate,
      endDate,
    );
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
