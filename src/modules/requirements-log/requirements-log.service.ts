import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateRequirementsLogDto } from './dto/create-requirements-log.dto';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { RequirementsLogEntity } from 'src/entities/requirements-log.entity';
import { UsersService } from '../users/users.service';
import { Types } from 'mongoose';

import { Record } from 'src/entities/requirements-log.entity';

@Injectable()
export class RequirementsLogService {
  constructor(
    @InjectModel(RequirementsLogEntity)
    private readonly requirementsLogRepository: ModelType<RequirementsLogEntity>,
    private readonly usersService: UsersService,
  ) {}

  async create(createRequirementsLogDto: CreateRequirementsLogDto) {
    const { requirement, updatedBy, records } = createRequirementsLogDto || {};

    if (!requirement) {
      throw new BadRequestException('Field requirementId not provided');
    }

    if (!updatedBy) {
      throw new BadRequestException('Field updatedBy not provided');
    }

    const user = await this.usersService.findOne(updatedBy);

    const updatedRecords: Record[] = [];

    records.map((record: Record) => {
      if (requirement[record.field]) {
        record.oldValue = requirement[record.field];

        const requirementUpdatedAt = requirement?.updatedAt;

        if (requirementUpdatedAt && record.field === 'status') {
          record.timeElapsed = Date.now() - requirementUpdatedAt.getTime();
        }

        updatedRecords.push(record);
      }
    });

    return await this.requirementsLogRepository
      .create({
        ...createRequirementsLogDto,
        records: updatedRecords,
        updatedBy: user,
        requirementId: requirement._id,
      })
      .catch((error) => {
        Logger.error(error);
        throw new BadRequestException(error.message);
      });
  }

  async findByRequirementId(requirementId: Types.ObjectId) {
    if (!requirementId) {
      throw new BadRequestException('Field requirementId not provided');
    }

    const logs = await this.requirementsLogRepository.aggregate([
      {
        $match: { requirementId },
      },
    ]);

    return { logs };
  }
}
