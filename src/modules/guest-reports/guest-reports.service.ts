import {
  BadRequestException,
  Injectable,
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
import { UsersByUnitService } from '../users-by-unit/users-by-unit.service';
import { VisitorsService } from '../visitors/visitors.service';

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
    private readonly usersByUnitsService: UsersByUnitService,
    private readonly visitorsService: VisitorsService,
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
      visitors,
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

      const userByUnit = await this.usersByUnitsService.findByUserId(user._id);
      if (!userByUnit) {
        throw new BadRequestException(
          'Usuario no autorizado para realizar esta transacción con el apartamento seleccionado.',
        );

        //TODO: clean this
        // await this.usersByUnitsService.create({
        //   unit: unit._id,
        //   user: user._id,
        //   condition: createUserDto.condition,
        // });
      }
    } else {
      throw new BadRequestException(
        'Usuario no autorizado para realizar esta transacción.',
      );
      // createUserDto.unit = unit._id;
      // user = await this.usersService.create(createUserDto);
    }

    //****************************************************************************/
    //******************* HANDLING PET  *****************************************/

    const { _id: petId, kind } = createPetDto || {};

    let pet: PetEntity | null = null;
    if (petId) {
      pet = await this.petsService.findOne(new Types.ObjectId(petId));
      const petUnit = pet.unit;
      const petCondominium = pet.condominium;

      if (!pet.unit.includes(unit._id)) {
        petUnit.push(unit._id as Ref<UnitEntity>);
      }
      if (!pet.condominium.includes(condominium._id)) {
        petCondominium.push(condominium._id as Ref<CondominiumEntity>);
      }

      await this.petsService.update(pet._id, {
        condominium: petCondominium,
        unit: petUnit,
      });
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

    const newGuestReport = await this.guestReportRepository
      .create({
        arrivalDate,
        departureDate,
        guestQty,
        unit,
        user,
        pet,
        vehicle,
        condominium,
        visitors,
      })
      .catch((error) => {
        Logger.error(error);
        throw new BadRequestException(error.message);
      });

    await this.visitorsService.create({
      visitors,
      unit: unit._id,
      guestReportId: newGuestReport._id,
    });

    return newGuestReport;
  }

  async findAll(
    condominium: Types.ObjectId,
    startingDate: Date,
    endingDate: Date,
  ) {
    const response = await this.guestReportRepository
      .find({
        'condominium._id': condominium,
        arrivalDate: {
          $gte: startingDate,
          $lte: endingDate,
        },
        departureDate: { $gte: startingDate, $lte: endingDate },
      })
      .sort({ arrivalDate: 1 })
      .sort({ departureDate: 1 })
      .catch((error) => {
        Logger.error(error);
        throw new BadRequestException(error.message);
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
        throw new BadRequestException(error.message);
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
        throw new BadRequestException(error.message);
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
        throw new BadRequestException(error.message);
      });
  }
}
