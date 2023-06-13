import { Test, TestingModule } from '@nestjs/testing';
import { GuestReportsService } from './guest-reports.service';

describe('GuestReportsService', () => {
  let service: GuestReportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuestReportsService],
    }).compile();

    service = module.get<GuestReportsService>(GuestReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
