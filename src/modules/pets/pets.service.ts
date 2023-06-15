import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePetDto } from '../../common/dtos/create-pet.dto';
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

  async findByName(name: string) {
    const response = await this.petRepository
      .findOne({ name })
      .catch((error) => {
        Logger.error(error);
        throw new BadRequestException(error.message);
      });

    if (!response) {
      throw new NotFoundException('No pet was found for the provided name');
    }

    return response;
  }

  // async findOne(_id: Types.ObjectId) {
  //   const response = await this.petRepository
  //     .findOne({ _id })
  //     .catch((error) => {
  //       Logger.error(error);
  //       throw new InternalServerErrorException(error.message);
  //     });

  //   if (!response) {
  //     throw new NotFoundException('No pet was found for the provided _id');
  //   }

  //   return response;
  // }

  async update(id: number, updatePetDto: UpdatePetDto) {
    return `This action updates a #${id} pet`;
  }

  async remove(id: number) {
    return `This action removes a #${id} pet`;
  }
}
