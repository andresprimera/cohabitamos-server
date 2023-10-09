import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  status: string;

  @IsBoolean()
  isUrgent: boolean;

  @IsBoolean()
  isImportant: boolean;

  @IsDateString()
  estStartDate: Date;

  @IsDateString()
  estEndDate: Date;

  @IsOptional()
  @IsDateString()
  actualStartDate: Date;

  @IsOptional()
  @IsDateString()
  actualEndDate: Date;
}
