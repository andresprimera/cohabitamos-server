import { PartialType } from '@nestjs/mapped-types';
import { CreatePetDto } from '../../../common/dtos/create-pet.dto';

export class UpdatePetDto extends PartialType(CreatePetDto) {}
