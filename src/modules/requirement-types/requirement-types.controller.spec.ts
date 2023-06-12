import { Test, TestingModule } from '@nestjs/testing';
import { RequirementTypesController } from './requirement-types.controller';
import { RequirementTypesService } from './requirement-types.service';

describe('RequirementTypesController', () => {
  let controller: RequirementTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequirementTypesController],
      providers: [RequirementTypesService],
    }).compile();

    controller = module.get<RequirementTypesController>(RequirementTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
