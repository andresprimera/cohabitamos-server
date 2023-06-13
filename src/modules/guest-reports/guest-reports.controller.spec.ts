import { Test, TestingModule } from '@nestjs/testing';
import { GuestReportsController } from './guest-reports.controller';
import { GuestReportsService } from './guest-reports.service';

describe('GuestReportsController', () => {
  let controller: GuestReportsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuestReportsController],
      providers: [GuestReportsService],
    }).compile();

    controller = module.get<GuestReportsController>(GuestReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
