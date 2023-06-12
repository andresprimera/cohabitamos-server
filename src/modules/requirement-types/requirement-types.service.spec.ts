import { Test, TestingModule } from '@nestjs/testing';
import { RequirementTypesService } from './requirement-types.service';

describe('RequirementTypesService', () => {
  let service: RequirementTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequirementTypesService],
    }).compile();

    service = module.get<RequirementTypesService>(RequirementTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
