import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { PetEntity } from 'src/entities/pet.entity';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { Types } from 'mongoose';

@Injectable()
export class PetsService {
  constructor(
    @InjectModel(PetEntity)
    private readonly petRepository: ReturnModelType<typeof PetEntity>,
  ) {}

  async create(createPetDto: CreatePetDto) {
    return await this.petRepository.create(createPetDto).catch((error) => {
      Logger.error(error);
      throw new InternalServerErrorException(error.message);
    });
  }

  async findAll(condominium: Types.ObjectId) {
    return await this.petRepository.find({ condominium }).catch((error) => {
      Logger.error(error);
      throw new InternalServerErrorException(error.message);
    });
  }

  async findOne(id: number) {
    return `This action returns a #${id} pet`;
  }

  async update(id: number, updatePetDto: UpdatePetDto) {
    return `This action updates a #${id} pet`;
  }

  async remove(id: number) {
    return `This action removes a #${id} pet`;
  }
}
