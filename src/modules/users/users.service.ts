import {
  Injectable,
  BadRequestException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../../common/dtos/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { UserEntity } from '../../entities/user.entity';
import { Types } from 'mongoose';
import { UsersByUnitService } from '../users-by-unit/users-by-unit.service';
import { UnitsService } from '../units/units.service';
import { Firebase } from 'src/providers/firebase';
import { AccountsService } from '../accounts/accounts.service';
import { CondominiumsService } from '../condominiums/condominiums.service';
import { excelUtils } from 'utils';
import { headers, worksheetNames } from './userExcelFile.definition';
import { classToClassFromExist } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserEntity)
    private readonly userRepository: ReturnModelType<typeof UserEntity>,
    private readonly unitService: UnitsService,
    private readonly usersByUnitService: UsersByUnitService,
    private readonly firebase: Firebase,
    private readonly accountService: AccountsService,
    private readonly condominiumService: CondominiumsService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    let unit = null;

    //*************** VALIDATIONS ***********************/
    if (createUserDto.role === 'usuario') {
      if (!createUserDto?.unit) {
        throw new NotFoundException('No unit _id was provided');
      }

      unit = this.unitService.findOne(createUserDto.unit as Types.ObjectId);
      if (!unit) {
        throw new NotFoundException(
          'No unit was found for the provided unit _id',
        );
      }
    }

    if (createUserDto.role === 'operador') {
      if (!createUserDto?.condominium) {
        throw new NotFoundException('No condominium _id was provided');
      }
    }

    let firebaseUser = null;
    //*************** CREATE USER ON FIREBASE AUTH ***********************/

    if (createUserDto.role !== 'usuario') {
      const auth = this.firebase.getAuth();
      firebaseUser = await auth
        .createUser({
          email: createUserDto.email,
          emailVerified: true,
          password: createUserDto?.password || 'qwerty',
          displayName: `${createUserDto.firstName} ${createUserDto.lastName} `,
          disabled: false,
        })
        .catch((error) => {
          // Firebase auth validates if the user email is already in use
          Logger.error(error);
          throw new BadRequestException(error.message);
        });
    }

    //*************** CREATE USER ON DATABASE ***********************/
    const newUser = await this.userRepository
      .create({ ...createUserDto, uid: firebaseUser?.uid || null })
      .catch((error) => {
        Logger.error(error);
        throw new BadRequestException(error.message);
      });

    //*************** ASSIGN USER TO A UNIT ***********************/
    if (createUserDto.role === 'usuario' && unit) {
      await this.usersByUnitService.create({
        unit: createUserDto.unit as Types.ObjectId,
        user: newUser._id,
        condition: createUserDto.condition,
      });
    }

    //*************** CREATING ACCOUNT IN CASE OF ADMINISTRATOR ***********************/
    if (createUserDto.role === 'administrador') {
      await this.accountService.create({
        owner: newUser._id,
        startingDate: new Date(),
        nextBillingDate: new Date(
          new Date().getTime() + 30 * 24 * 60 * 60 * 1000,
        ),
        status: 'Activo',
      });
    }

    //*************** ASSIGNING PERMITIONS TO OPERATOR ***********************/
    if (createUserDto.role === 'operador') {
      const condominium = await this.condominiumService.findOne(
        createUserDto.condominium as Types.ObjectId,
      );

      await this.userRepository.findOneAndUpdate(
        { _id: newUser._id },
        {
          permissions: {
            condominiums: [condominium._id],
            account: condominium.account,
          },
        },
      );
    }

    return newUser;
  }

  async createByFileUpload(
    filePath: string,
    requestCondominium: Types.ObjectId,
  ) {
    const condominium = await this.condominiumService.findOne(
      requestCondominium,
    );

    if (!condominium) {
      throw new NotFoundException(
        'No condominium was found for the provided _id',
      );
    }

    const excelInfo: any = await excelUtils.extractData(
      filePath,
      worksheetNames,
      headers,
    );
    /* VALIDATING NIT */

    const unitsArrayByWorksheet: any = [];

    worksheetNames.forEach((worksheetName) => {
      const worksheetUnits: any = [];
      excelInfo.worksheets[worksheetName].data.forEach(
        (row: any, rowIndex: number) => {
          if (row['NIT-EDIFICIO'] !== condominium.nit) {
            excelInfo.worksheets[worksheetName].errors.push(
              `El NIT especificado en la fila ${
                rowIndex + 2
              } no coincide con el NIT del edificio`,
            );
            excelInfo.success = false;
            excelInfo.message = 'Errores de validación de NIT Encontrados';
          }

          worksheetUnits.push({
            $and: [
              { number: row['NUMERO'] },
              { type: row['TIPO-UNIDAD'] },
              { block: row['NOMBRE-TORRE'] },
              { condominium: condominium._id },
            ],
          });
        },
      );

      unitsArrayByWorksheet.push(worksheetUnits);
    });

    /* VALIDATING UNITS EXISTANCE */
    const existingUnits = await Promise.all(
      unitsArrayByWorksheet.map(async (worksheetUnits: any) => {
        return (await worksheetUnits.length) === 0
          ? [] // if there is no rows on ether of the worksheets return an empty array
          : this.unitService.findMany(worksheetUnits);
      }),
    );

    const createAndUpdateInfo = worksheetNames.map((worksheetName, index) => {
      return excelInfo.worksheets[worksheetName].data.map(
        (row: any, rowIndex: number) => {
          existingUnits[index].forEach((unit: any) => {
            if (
              unit.number === String(row['NUMERO']) &&
              unit.type === row['TIPO-UNIDAD'] &&
              unit.block === String(row['NOMBRE-TORRE'])
            ) {
              row.unit = unit._id;
            }
          });

          if (!row.unit) {
            excelInfo.worksheets[worksheetName].errors.push(
              `La unidad especificada en la fila ${
                rowIndex + 2
              } de la hoja ${worksheetName}, no se consigue en la base de datos, o el apartamento está repetido.`,
            );
            excelInfo.success = false;
            excelInfo.message = 'Errores de validación unidades encontrados';
          }
          return row;
        },
      );
    });

    const usersToCreate: any = [];
    const usersEmails: string[] = [];

    /* EXTRACTING USER'S INFO TO CREATE */
    createAndUpdateInfo[0].forEach((user: any) => {
      const newUser = {
        firstName: user['PRIMER-NOMBRE'],
        lastName: user['PRIMER-APELLIDO'],
        role: 'usuario',
        email: user['EMAIL'],
        phone: user['TELEFONO'],
        whatsapp: user['WHATSAPP'],
        docType: user['TIPO-DOCUMENTO'],
        docNumber: user['NUMERO-DOCUMENTO'],
        // nationality: 'string',
        condition: user['CONDICION'],
        unit: user.unit,
        password: user['NUMERO-DOCUMENTO'] || 'qwerty',
        condominium: condominium._id,
      };

      usersEmails.push(user['EMAIL']);
      usersToCreate.push(newUser);
    });

    createAndUpdateInfo[1].forEach((user: any) => {
      usersEmails.push(user['EMAIL']);
    });

    /* VALIDATING EMAILS EXISTANCE*/
    const existingUsers = await this.findManyByEmail(usersEmails);

    createAndUpdateInfo[0].forEach((user: any, rowIndex: number) => {
      const userToCreate = existingUsers.find(
        (existingUser: any) => existingUser.email === user['EMAIL'],
      );

      if (userToCreate) {
        excelInfo.worksheets[worksheetNames[0]].errors.push(
          `El correo ${user['EMAIL']} reportado en la fila ${
            rowIndex + 2
          } no se puede crear porque ya se encuentra registrado.`,
        );
        excelInfo.success = false;
        excelInfo.message =
          'Errores durante la validación de correos electrónicos';
      }
    });

    /* EXTRACTING USER'S INFO TO UPDATE */
    const usersToUpdate: any = [];
    createAndUpdateInfo[1].forEach((user: never | any, rowIndex: number) => {
      const userToUpdate = existingUsers.find(
        (existingUser: any) => existingUser.email === user['EMAIL'],
      );

      if (!userToUpdate) {
        excelInfo.worksheets[worksheetNames[1]].errors.push(
          `El correo ${user['EMAIL']} reportado en la fila ${
            rowIndex + 2
          } no se puede actualizar porque no se encuentra registrado.`,
        );
        excelInfo.success = false;
        excelInfo.message =
          'Errores durante la validación de correos electrónicos';
      } else {
        const newUser = {
          firstName: user['PRIMER-NOMBRE'],
          lastName: user['PRIMER-APELLIDO'],
          phone: userToUpdate.phone.includes(user['TELEFONO'] as never)
            ? userToUpdate.phone
            : [...userToUpdate.phone, user['TELEFONO']],
          whatsapp: user['WHATSAPP'],
          nationality: 'string',
          _id: userToUpdate._id,
        };

        usersToUpdate.push(newUser);
      }
    });

    /* RETURNING EARLY IF THERE ARE ERRORS */

    if (!excelInfo.success) {
      return excelInfo;
    }

    /* CREATING USERS */

    usersToCreate.forEach(async (user: any) => {
      await this.create(user);
    });

    usersToUpdate.forEach(async (user: any) => {
      await this.update(user._id, user);
    });

    return {
      success: true,
      message: 'Archivo cargado con éxito',
      worksheets: excelInfo.worksheets,
    };
  }

  async findAll(type: string | undefined, requestCondominium: Types.ObjectId) {
    //TODO: Pagination
    const condominium = await this.condominiumService
      .findOne(requestCondominium)
      .catch((error) => {
        Logger.error(error);
        throw new BadRequestException(error.message);
      });

    const account = await this.accountService
      .findOneById(condominium.account)
      .catch((error) => {
        Logger.error(error);
        throw new BadRequestException(error.message);
      });

    if (type && type === 'usuarios-administrativos') {
      return await this.userRepository
        .find({ 'permissions.account': account._id })
        .catch((error) => {
          Logger.error(error);
          throw new BadRequestException(error.message);
        });
    } else {
      return await this.userRepository
        .find({
          'permissions.condominiums': {
            $in: [condominium._id],
          },
        })
        .catch((error) => {
          Logger.error(error);
          throw new BadRequestException(error.message);
        });
    }
  }

  async findManyByEmail(usersEmails: string[]) {
    return await this.userRepository
      .find({ email: usersEmails })
      .catch((error) => {
        Logger.error(error);
        throw new BadRequestException(error.message);
      });
  }

  async findOne(_id: Types.ObjectId) {
    const response = await this.userRepository
      .findOne({ _id })
      .catch((error) => {
        Logger.error(error);
        throw new BadRequestException(error.message);
      });

    if (!response) {
      throw new NotFoundException('No user was found for the provided _id');
    }

    return response;
  }

  async findByUid(uid: string) {
    const response = await this.userRepository
      .findOne({ uid })
      .catch((error) => {
        Logger.error(error);
        throw new BadRequestException(error.message);
      });

    if (!response) {
      throw new NotFoundException('No user was found for the provided uid');
    }

    return response;
  }

  async findUserByEmail(email: string) {
    const response = await this.userRepository
      .aggregate([
        {
          $match: { email },
        },
        {
          $lookup: {
            from: 'users_by_unit',
            localField: '_id',
            foreignField: 'user',
            as: 'units',
            pipeline: [
              {
                $lookup: {
                  from: 'units',
                  localField: 'unit',
                  foreignField: '_id',
                  as: 'unit',
                },
              },
              {
                $unwind: '$unit',
              },
              {
                $project: {
                  _id: '$unit._id',
                  number: '$unit.number',
                  type: '$unit.type',
                  block: '$unit.block',
                  condominium: '$unit.condominium',
                  condition: 1,
                },
              },
            ],
          },
        },
      ])
      .catch((error) => {
        Logger.error(error);
        throw new BadRequestException(error.message);
      });

    if (response.length === 0) {
      throw new NotFoundException('No user was found for the provided email');
    }

    return response[0];
  }

  async getOperatorsByAccount(ownerId: Types.ObjectId) {
    const account = await this.accountService
      .findOne(ownerId)
      .catch((error) => {
        Logger.error(error);
        throw new BadRequestException(error.message);
      });

    if (!account) {
      throw new NotFoundException('No account was found for the provided _id');
    }

    return await this.userRepository
      .find({ 'permissions.account': account._id })
      .catch((error) => {
        Logger.error(error);
        throw new BadRequestException(error.message);
      });
  }

  async update(_id: Types.ObjectId, updateUserDto: UpdateUserDto) {
    const response = await this.userRepository
      .findOneAndUpdate({ _id }, updateUserDto, {
        new: true,
      })
      .catch((error) => {
        Logger.log(error.message);
        throw new BadRequestException(error.message);
      });

    if (!response) {
      throw new NotFoundException('No user was found for the provided _id');
    }

    return response;
  }

  async remove(_id: Types.ObjectId) {
    return await this.userRepository.deleteOne({ _id }).catch((error) => {
      Logger.error(error);
      throw new BadRequestException(error.message);
    });
  }
}
