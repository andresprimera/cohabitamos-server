import { Injectable } from '@nestjs/common';
import { CreateVisitorDto } from '../../common/dtos/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';
import { VisitorsEntity } from 'src/entities/visitors.entity';
import { ReturnModelType } from '@typegoose/typegoose';
import { CondominiumsService } from '../condominiums/condominiums.service';
import { InjectModel } from 'nestjs-typegoose';
import { Types } from 'mongoose';
import { UnitsService } from '../units/units.service';
import { getModelForClass } from '@typegoose/typegoose';

@Injectable()
export class VisitorsService {
  constructor(
    @InjectModel(VisitorsEntity)
    private readonly visitorRepository: ReturnModelType<typeof VisitorsEntity>,
    private readonly condominiumRepository: CondominiumsService,
    private readonly unitRepository: UnitsService,
  ) {}

  async create(createVisitorDto: CreateVisitorDto) {
    const unit = await this.unitRepository.findOne(
      new Types.ObjectId(createVisitorDto.unit),
    );

    const condominium = await this.condominiumRepository.findOne(
      unit.condominium as Types.ObjectId,
    );

    const visitorModel = getModelForClass(VisitorsEntity);

    const visitors = createVisitorDto.visitors.map((visitor) => {
      const newVisitor = new visitorModel();
      newVisitor.nationality = visitor.nationality;
      newVisitor.docType = visitor.docType;
      newVisitor.docNumber = visitor.docNumber;
      newVisitor.condition = visitor.condition;
      newVisitor.firstName = visitor.firstName;
      newVisitor.lastName = visitor.lastName;
      newVisitor.email = visitor.email;
      newVisitor.phone = visitor.phone;
      newVisitor.whatsapp = visitor.whatsapp;
      newVisitor.unit = unit._id;
      newVisitor.condominium = condominium._id;
      newVisitor.guestReportId = createVisitorDto.guestReportId;

      return newVisitor;
    });

    return await this.visitorRepository.bulkSave(visitors);
  }

  findAll() {
    return `This action returns all visitors`;
  }

  findOne(docNumber: string) {
    return this.visitorRepository.findOne({ docNumber });
  }

  update(id: number, updateVisitorDto: UpdateVisitorDto) {
    return `This action updates a #${id} visitor`;
  }

  remove(id: number) {
    return `This action removes a #${id} visitor`;
  }
}
