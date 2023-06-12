import { Injectable } from '@nestjs/common';
import { CreateRequirementTypeDto } from './dto/create-requirement-type.dto';
import { UpdateRequirementTypeDto } from './dto/update-requirement-type.dto';

@Injectable()
export class RequirementTypesService {
  create(createRequirementTypeDto: CreateRequirementTypeDto) {
    return 'This action adds a new requirementType';
  }

  findAll() {
    return `This action returns all requirementTypes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} requirementType`;
  }

  update(id: number, updateRequirementTypeDto: UpdateRequirementTypeDto) {
    return `This action updates a #${id} requirementType`;
  }

  remove(id: number) {
    return `This action removes a #${id} requirementType`;
  }
}
