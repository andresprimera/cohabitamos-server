import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateGuestReportDto } from './dto/create-guest-report.dto';
import { UpdateGuestReportDto } from './dto/update-guest-report.dto';
import { UnitEntity } from 'src/entities/unit.entity';
import { InjectModel } from 'nestjs-typegoose';
import { GuestReportEntity } from 'src/entities/guest-report.entity';
import { Ref, ReturnModelType } from '@typegoose/typegoose';
import { UsersService } from '../users/users.service';
import { UnitsService } from '../units/units.service';
import { CondominiumsService } from '../condominiums/condominiums.service';
import { Types } from 'mongoose';
import { CondominiumEntity } from 'src/entities/condominium.entity';
import { UserEntity } from 'src/entities/user.entity';
import { PetEntity } from 'src/entities/pet.entity';
import { PetsService } from '../pets/pets.service';
import { VehiclesService } from '../vehicles/vehicles.service';
import { VehiclesEntity } from 'src/entities/vehicle.entity';

@Injectable()
export class GuestReportsService {
  constructor(
    @InjectModel(GuestReportEntity)
    private readonly guestReportRepository: ReturnModelType<
      typeof GuestReportEntity
    >,
    private readonly usersService: UsersService,
    private readonly unitsService: UnitsService,
    private readonly condominiumsService: CondominiumsService,
    private readonly petsService: PetsService,
    private readonly vehicleService: VehiclesService,
  ) {}

  async create(createGuestReportDto: CreateGuestReportDto) {
    const {
      arrivalDate,
      departureDate,
      guestQty,
      unit: unitId,
      user: createUserDto,
      pet: createPetDto,
      vehicle: createVehicleDto,
    } = createGuestReportDto;

    if (!createUserDto) {
      throw new BadRequestException('Required field user not provided.');
    }

    if (!unitId) {
      throw new BadRequestException('Required field unit not provided.');
    }

    const unit: UnitEntity = await this.unitsService.findOne(
      new Types.ObjectId(unitId),
    );

    const condominium: CondominiumEntity =
      await this.condominiumsService.findOne(
        new Types.ObjectId(String(unit.condominium)),
      );

    //******************* HANDLING USER  *****************************************/
    const { _id: userId } = createUserDto;

    let user: UserEntity;
    if (userId) {
      user = await this.usersService.findOne(new Types.ObjectId(userId));
    } else {
      createUserDto.account = condominium.account;
      user = await this.usersService.create(createUserDto);
    }

    //****************************************************************************/
    //******************* HANDLING PET  *****************************************/

    const { _id: petId, kind } = createPetDto || {};

    let pet: PetEntity | null = null;
    if (petId) {
      //TODO: assign an existing pet to an appartment
      pet = await this.petsService.findOne(new Types.ObjectId(petId));
    } else if (kind && kind !== '') {
      createPetDto.unit = [unit._id];
      createPetDto.condominium = [condominium._id];

      pet = await this.petsService.create(createPetDto);
    }

    //****************************************************************************/
    //******************* HANDLING VEHICLE  **************************************/

    const { _id: vehicleId, plate } = createVehicleDto || {};

    let vehicle: VehiclesEntity | null = null;
    if (vehicleId) {
      vehicle = await this.vehicleService.findOne(
        new Types.ObjectId(vehicleId),
      );
      const vehicleUnit = vehicle.unit;
      const vehicleCondominium = vehicle.condominium;

      if (!vehicle.unit.includes(unit._id)) {
        vehicleUnit.push(unit._id as Ref<UnitEntity>);
      }
      if (!vehicle.condominium.includes(condominium._id)) {
        vehicleCondominium.push(condominium._id as Ref<CondominiumEntity>);
      }
      await this.vehicleService.update(vehicle._id, {
        condominium: vehicleCondominium,
        unit: vehicleUnit,
      });
    } else if (plate && plate !== '') {
      createVehicleDto.unit = [unit._id];
      createVehicleDto.condominium = [condominium._id];
      vehicle = await this.vehicleService.create(createVehicleDto);
    }

    //****************************************************************************/

    return await this.guestReportRepository
      .create({
        arrivalDate,
        departureDate,
        guestQty,
        unit,
        user,
        pet,
        vehicle,
        condominium,
      })
      .catch((error) => {
        Logger.error(error);
        throw new InternalServerErrorException(error.message);
      });
  }

  async findAll(condominium: Types.ObjectId) {
    const response = await this.guestReportRepository
      .find({
        'condominium._id': condominium,
      })
      .catch((error) => {
        Logger.error(error);
        throw new InternalServerErrorException(error.message);
      });

    if (!response) {
      throw new NotFoundException(
        'No guesst-report was found for this condominium',
      );
    }

    return response;
  }

  async findOne(_id: Types.ObjectId) {
    const response = await this.guestReportRepository
      .findOne({ _id })
      .catch((error) => {
        Logger.error(error);
        throw new InternalServerErrorException(error.message);
      });

    if (!response) {
      throw new NotFoundException(
        'No guest report was found for the provided _id',
      );
    }

    return response;
  }

  async update(
    _id: Types.ObjectId,
    updateGuestReportDto: UpdateGuestReportDto,
  ) {
    const response = await this.guestReportRepository
      .findOneAndUpdate({ _id }, updateGuestReportDto, {
        new: true,
      })
      .catch((error) => {
        Logger.log(error.message);
        throw new InternalServerErrorException(error.message);
      });

    if (!response) {
      throw new NotFoundException(
        'No guest report was found for the provided _id',
      );
    }

    return response;
  }

  async remove(_id: Types.ObjectId) {
    return await this.guestReportRepository
      .deleteOne({ _id })
      .catch((error) => {
        Logger.error(error);
        throw new InternalServerErrorException(error.message);
      });
  }
}
