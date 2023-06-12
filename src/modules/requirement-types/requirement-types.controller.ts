import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RequirementTypesService } from './requirement-types.service';
import { CreateRequirementTypeDto } from './dto/create-requirement-type.dto';
import { UpdateRequirementTypeDto } from './dto/update-requirement-type.dto';

@Controller('requirement-types')
export class RequirementTypesController {
  constructor(
    private readonly requirementTypesService: RequirementTypesService,
  ) {}

  @Post()
  create(@Body() createRequirementTypeDto: CreateRequirementTypeDto) {
    return this.requirementTypesService.create(createRequirementTypeDto);
  }

  @Get()
  findAll() {
    return this.requirementTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requirementTypesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRequirementTypeDto: UpdateRequirementTypeDto,
  ) {
    return this.requirementTypesService.update(+id, updateRequirementTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requirementTypesService.remove(+id);
  }
}
