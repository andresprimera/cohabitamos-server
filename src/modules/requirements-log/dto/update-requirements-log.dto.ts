import { PartialType } from '@nestjs/mapped-types';
import { CreateRequirementsLogDto } from './create-requirements-log.dto';

export class UpdateRequirementsLogDto extends PartialType(CreateRequirementsLogDto) {}
