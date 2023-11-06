import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCondominiumDto } from './dto/create-condominium.dto';
import { UpdateCondominiumDto } from './dto/update-condominium.dto';
import { CondominiumEntity } from 'src/entities/condominium.entity';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { Types } from 'mongoose';
import { UnitsService } from '../units/units.service';
import { OptionsService } from '../options/options.service';
import { RequirementTypesService } from '../requirement-types/requirement-types.service';
import { UserEntity } from 'src/entities/user.entity';
import { AccountsService } from '../accounts/accounts.service';
import { excelUtils } from 'utils';
import { headers, worksheetNames } from './excelFile.definition';

@Injectable()
export class CondominiumsService {
  constructor(
    @InjectModel(CondominiumEntity)
    private readonly condominiumRepository: ReturnModelType<
      typeof CondominiumEntity
    >,

    private readonly unitsService: UnitsService,
    private readonly optionsService: OptionsService,
    private readonly requirementsTypeService: RequirementTypesService,
    private readonly accountService: AccountsService,
  ) {}

  async create(createCondominiumDto: CreateCondominiumDto) {
    const condominium = await this.condominiumRepository
      .create(createCondominiumDto)
      .catch((error) => {
        Logger.error(error);
        throw new BadRequestException(error.message);
      });

    const data = await this.optionsService.findAll();

    const defaultReqTypes = data[0].DEFAULT_REQUIREMENTS_TYPES;

    defaultReqTypes.map(async (type) => {
      await this.requirementsTypeService
        .create({ value: type, condominium: condominium._id })
        .catch((error) => {
          Logger.error(error);
          throw new BadRequestException(error.message);
        });
    });

    return condominium;
  }

  async createByFileUpload(filePath: string, operator: UserEntity) {
    const account = await this.accountService.findOne(operator._id);

    const excelInfo: any = await excelUtils.extractData(
      filePath,
      worksheetNames,
      headers,
    );

    if (!excelInfo.success) {
      return excelInfo;
    }

    const condoData = excelInfo.worksheets['DATOS DE COPROPIEDAD'].data[0];
    const blocksData = excelInfo.worksheets['TORRES'].data;
    const unitsData = excelInfo.worksheets['UNIDADES'].data;

    //************* VALIDATE UNIT QTY BY BLOCK ***************/

    const unitQtyByBlock = blocksData.reduce(
      (total: any, unit: any) => total + unit['CANTIDAD-DE-UNIDADES'],
      0,
    );

    if (condoData['CANTIDAD-DE-UNIDADES'] !== unitQtyByBlock) {
      throw new BadRequestException(
        `La suma del número de unidades reportadas en la hoja TORRE es de ${unitQtyByBlock} unidades, pero en la hoja DATOS DE COPROPIEDAD se registraron ${condoData['CANTIDAD-DE-UNIDADES']}.`,
      );
    }

    const blocks = blocksData.map((block: any) => {
      const unitQty = unitsData.reduce(
        (total: number, unit: any) =>
          String(unit['NOMBRE-TORRE']) === String(block['NOMBRE-TORRE'])
            ? total + 1
            : total,
        0,
      );

      if (block['CANTIDAD-DE-UNIDADES'] !== unitQty) {
        throw new BadRequestException(
          `Para la torre ${block['NOMBRE-TORRE']} se registraron ${block['CANTIDAD-DE-UNIDADES']} en la pestaña TORRES pero su subieron ${unitQty} en la pestaña UNIDADES`,
        );
      }
      return String(block['NOMBRE-TORRE']);
    });

    const condominium = {
      account: account._id,
      address: condoData['DIRECCION'],
      unitQty: condoData['CANTIDAD-DE-UNIDADES'],
      name: condoData['NOMBRE'],
      email: condoData['CORREO-ADMINISTRACION'],
      blocks: blocks,
      nit: condoData['NIT'],
      verificationDigit: condoData['DIGITO-VERIFICACION'],
      receptionPhoneNumber: condoData['TELEFONO'],
    };

    const newCondominium = await this.create(condominium);

    const units = unitsData.map((unit: any) => {
      return {
        number: unit['NUMERO'],
        block: unit['NOMBRE-TORRE'],
        type: unit['TIPO-UNIDAD'],
        condominium: newCondominium._id,
      };
    });

    await this.unitsService.createMany(units);

    return {
      message: 'Edificio creado con éxito',
      success: true,
      worksheets: {
        ['DATOS DE COPROPIEDAD']: excelInfo.worksheets['DATOS DE COPROPIEDAD'],
        ['TORRES']: excelInfo.worksheets['TORRES'],
        ['UNIDADES']: excelInfo.worksheets['UNIDADES'],
      },
    };
  }

  async findAll(operator: UserEntity) {
    const account = await this.accountService
      .findOne(operator?._id)
      .catch((error) => {
        Logger.log(error);
        throw new NotFoundException(error.message);
      });

    return await this.condominiumRepository
      .find({ account: account._id })
      .catch((error) => {
        Logger.error(error);
        throw new BadRequestException(error.message);
      });
  }

  async findEveryCondominium() {
    return await this.condominiumRepository.find().catch((error) => {
      Logger.error(error);
      throw new BadRequestException(error.message);
    });
  }

  async findOne(_id: Types.ObjectId) {
    const response = await this.condominiumRepository
      .aggregate([
        { $match: { _id } }, // This will ensures that there is only 1 object in the response array
        {
          $lookup: {
            from: 'units',
            localField: '_id',
            foreignField: 'condominium',
            as: 'units',
          },
        },
      ])
      .catch((error) => {
        Logger.error(error);
        throw new BadRequestException(error.message);
      });

    if (response && response.length === 0) {
      throw new NotFoundException(
        'No condominium was found for the provided _id',
      );
    }

    return response[0];
  }

  async update(
    _id: Types.ObjectId,
    updateCondominiumDto: UpdateCondominiumDto,
  ) {
    const response = await this.condominiumRepository
      .findOneAndUpdate({ _id }, updateCondominiumDto, {
        new: true,
      })
      .catch((error) => {
        Logger.log(error.message);
        throw new BadRequestException(error.message);
      });

    if (!response) {
      throw new NotFoundException(
        'No condominium was found for the provided _id',
      );
    }

    return response;
  }

  async remove(_id: Types.ObjectId) {
    const removedUnits = await this.unitsService
      .deleteMany(_id)
      .catch((error) => {
        Logger.error(error);
        throw new BadRequestException(error.message);
      });

    const removedCondominium = await this.condominiumRepository
      .deleteOne({ _id })
      .catch((error) => {
        Logger.error(error);
        throw new BadRequestException(error.message);
      });

    return { removedUnits, removedCondominium };
  }
}
