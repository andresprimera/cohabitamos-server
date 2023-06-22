import { Test, TestingModule } from '@nestjs/testing';
import { RequirementsLogService } from './requirements-log.service';

describe('RequirementsLogService', () => {
  let service: RequirementsLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequirementsLogService],
    }).compile();

    service = module.get<RequirementsLogService>(RequirementsLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
