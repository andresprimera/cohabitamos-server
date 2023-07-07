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
import { MulterFile } from 'src/common/interfaces';
import { Workbook } from 'exceljs';
import { excelValidate } from 'validation/excel.validations';
import { headers, worksheetNames } from './excelFile.definition';

import { unlinkSync } from 'fs';

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

  async createByFileUpload(file: MulterFile) {
    const condominiumInfo = await this.extractCondominiumData(file.path);

    return { condominiumInfo };
  }

  async findAll(operator: UserEntity) {
    const account = await this.accountService
      .findOne(operator._id)
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

  //************* HELPER FUNCTIONS  **************************************/

  private async extractCondominiumData(filePath: string) {
    const workbook = new Workbook();
    await workbook.xlsx.readFile(filePath);
    unlinkSync(filePath);

    const errors: string[] = [];

    //************** VALIDATING WORKSHEETS ********************************/

    const areWorksheetsValid = excelValidate.worksheets(
      worksheetNames,
      workbook,
    );

    //************** VALIDATING HEADERS ********************************/

    const areHeadersValid = excelValidate.headers(headers, workbook);

    //************** EXTRACTING DATA ***********************************/

    if (areWorksheetsValid && areHeadersValid) {
      return worksheetNames.map((worksheetName, index) => {
        const worksheet = workbook.getWorksheet(index + 1);

        let data: any = [];

        worksheet.eachRow((row: any, rowNumber: number) => {
          if (rowNumber === 1) return; // Skipping headers

          const values = row.values;
          values.shift();

          const jsonRow: any = {};

          headers[index].map((header, index) => {
            const error = excelValidate.cellTypes(
              header,
              values[index],
              rowNumber,
            );

            if (error) errors.push(error);

            jsonRow[header.title] = values[index];
          });

          data.push(jsonRow);
        });

        data = errors.length > 0 ? [] : data; //NOT SENDING DATA IN CASE OF ERRORS

        return { [worksheetName]: { data, errors } };
      });
    }
  }
}
