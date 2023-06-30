import { Injectable } from '@nestjs/common';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';
import { VisitorsEntity } from 'src/entities/visitors.entity';
import { ReturnModelType } from '@typegoose/typegoose';
import { Condominium } from 'gatewaySchemas';
import { CondominiumsService } from '../condominiums/condominiums.service';
import { InjectModel } from 'nestjs-typegoose';
import { Types } from 'mongoose';
import { UnitsService } from '../units/units.service';

@Injectable()
export class VisitorsService {
  constructor(
    @InjectModel(VisitorsEntity)
    private readonly visitorRepository: ReturnModelType<typeof VisitorsEntity>,
    private readonly condominiumRepository: CondominiumsService,
    private readonly unitRepository: UnitsService,
  ) {}

  // async create(createVisitorDto: CreateVisitorDto) {
  //   const unit = await this.unitRepository.findOne(
  //     new Types.ObjectId(createVisitorDto.unit),
  //   );

  //   const condominium = await this.condominiumRepository.findOne(
  //     unit.condominium as Types.ObjectId,
  //   );

  //   const visitors = createVisitorDto.visitors.map((visitor) => {
  //     // return new VisitorsEntity().getObject(
  //     //   visitor,
  //     //   createVisitorDto.unit,
  //     //   condominium._id,
  //     // );

  //     const object = new VisitorsEntity();

  //     object.guestReportId = new Types.ObjectId(visitor.guestReportId);
  //     object.firstName = visitor.firstName;
  //     object.lastName = visitor.lastName;
  //     object.email = visitor.email;
  //     object.phone = visitor.phone;
  //     object.whatsapp = visitor.whatsapp;
  //     object.nationality = visitor.nationality;
  //     object.docType = visitor.docType;
  //     object.docNumber = visitor.docNumber;
  //     object.condition = visitor.condition;
  //     object.unit = createVisitorDto.unit;
  //     object.condominium = condominium._id;

  //     return object;
  //   });

  //   const response = await this.visitorRepository.create(visitors);

  //   console.log({ response });

  //   return response;
  // }

  findAll() {
    return `This action returns all visitors`;
  }

  findOne(id: number) {
    return `This action returns a #${id} visitor`;
  }

  update(id: number, updateVisitorDto: UpdateVisitorDto) {
    return `This action updates a #${id} visitor`;
  }

  remove(id: number) {
    return `This action removes a #${id} visitor`;
  }
}
