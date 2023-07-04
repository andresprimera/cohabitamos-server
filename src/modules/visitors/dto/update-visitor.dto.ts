import { PartialType } from '@nestjs/mapped-types';
import { CreateVisitorDto } from '../../../common/dtos/create-visitor.dto';

export class UpdateVisitorDto extends PartialType(CreateVisitorDto) {}
