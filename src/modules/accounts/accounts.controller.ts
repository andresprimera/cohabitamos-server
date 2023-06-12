import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import mongoose, { Types } from 'mongoose';
import {
  ConvertParamToObjectId,
  ConvertToObjectId,
} from 'src/decorators/convert-to-objectId.decorator';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  create(
    @ConvertParamToObjectId(['owner']) createAccountDto: CreateAccountDto,
  ) {
    return this.accountsService.create(createAccountDto);
  }

  @Get()
  findAll() {
    return this.accountsService.findAll();
  }

  @Get(':_id')
  findOne(@ConvertToObjectId() _id: Types.ObjectId) {
    return this.accountsService.findOne(_id);
  }

  @Patch(':_id')
  update(
    @ConvertToObjectId() _id: Types.ObjectId,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    return this.accountsService.update(_id, updateAccountDto);
  }

  @Delete(':_id')
  remove(@ConvertToObjectId() _id: Types.ObjectId) {
    return this.accountsService.remove(_id);
  }
}
