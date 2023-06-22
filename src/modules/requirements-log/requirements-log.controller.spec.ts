import { Test, TestingModule } from '@nestjs/testing';
import { RequirementsLogController } from './requirements-log.controller';
import { RequirementsLogService } from './requirements-log.service';

describe('RequirementsLogController', () => {
  let controller: RequirementsLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequirementsLogController],
      providers: [RequirementsLogService],
    }).compile();

    controller = module.get<RequirementsLogController>(RequirementsLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
