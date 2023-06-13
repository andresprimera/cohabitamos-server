import { Module } from '@nestjs/common';
import { PetsService } from './pets.service';
import { PetsController } from './pets.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { PetEntity } from 'src/entities/pet.entity';

@Module({
  imports: [TypegooseModule.forFeature([PetEntity])],
  controllers: [PetsController],
  providers: [PetsService],
  exports: [PetsService],
})
export class PetsModule {}
