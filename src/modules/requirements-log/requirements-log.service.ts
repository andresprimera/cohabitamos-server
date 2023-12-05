import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateRequirementsLogDto } from './dto/create-requirements-log.dto';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { RequirementsLogEntity } from 'src/entities/requirements-log.entity';
import { UsersService } from '../users/users.service';
import { Types } from 'mongoose';

import { Record } from 'src/entities/requirements-log.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { EMAIL_ACTIONS, NOTIFICATION_COLLECTIONS } from 'src/common/enums';
import { INewRequestMessagePayload } from '../notifications/dto/new-request-message.dto';

@Injectable()
export class RequirementsLogService {
  constructor(
    @InjectModel(RequirementsLogEntity)
    private readonly requirementsLogRepository: ModelType<RequirementsLogEntity>,
    private readonly usersService: UsersService,
    private readonly notificationService: NotificationsService,
  ) {}

  async create(createRequirementsLogDto: CreateRequirementsLogDto) {
    const { requirement, updatedBy, records } = createRequirementsLogDto || {};

    if (!requirement) {
      throw new BadRequestException('Field requirementId not provided');
    }

    if (!updatedBy) {
      throw new BadRequestException('Field updatedBy not provided');
    }

    const msgAuthor = await this.usersService.findOne(updatedBy);

    const updatedRecords: Record[] = [];

    records.map((record: Record) => {
      if (requirement[record.field]) {
        record.oldValue = requirement[record.field];

        const requirementUpdatedAt = requirement?.updatedAt;

        if (requirementUpdatedAt) {
          record.timeElapsed = Date.now() - requirementUpdatedAt.getTime();
        }

        updatedRecords.push(record);
      }
    });

    let newReqLogId = '';

    return await this.requirementsLogRepository
      .create({
        ...createRequirementsLogDto,
        records: updatedRecords,
        updatedBy: msgAuthor,
        requirementId: requirement._id,
      })
      .then((newReqLog) => {
        newReqLogId = newReqLog._id.toString();
        return newReqLog;
      })
      .catch((error) => {
        Logger.error(error);
        throw new BadRequestException(error.message);
      })
      .finally(async () => {
        const { condominium, unit, user: pqrAuthor, _id } = requirement;

        if (
          !createRequirementsLogDto.message.includes('Requerimiento creado')
        ) {
          this.notificationService.sendEmail<INewRequestMessagePayload>({
            action: EMAIL_ACTIONS.NEW_REQUEST_MESSAGE,
            to: pqrAuthor?.email || '',
            payload: {
              condominiumName: condominium?.name || '',
              userEmail: pqrAuthor?.email || '',
              unitNumber: unit?.number || '',
              unitType: unit?.type || '',
              unitBlock: unit?.block || '',
              name: `${pqrAuthor?.firstName} ${pqrAuthor?.lastName}`,
              message: createRequirementsLogDto.message,
              author: `${msgAuthor.firstName} ${msgAuthor.lastName}`,
              condominiumId: condominium._id.toString(),
              status: requirement.status,
              requirementType: requirement.requirementType,
              dateTime: new Date().toLocaleString(),
            },
          });
        }

        await this.notificationService.createFirebaseNotification({
          collection: NOTIFICATION_COLLECTIONS.REQUIREMENTS_LOGS,
          objectId: _id.toString(),
          accountId: String(condominium.account),
          condominiumId: String(condominium._id),
        });
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
      {
        $sort: { createdAt: -1 },
      },
    ]);

    return { logs };
  }
}
