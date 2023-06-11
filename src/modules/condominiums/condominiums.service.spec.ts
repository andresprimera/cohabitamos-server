import { Test, TestingModule } from '@nestjs/testing';
import { CondominiumsService } from './condominiums.service';

describe('CondominiumsService', () => {
  let service: CondominiumsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CondominiumsService],
    }).compile();

    service = module.get<CondominiumsService>(CondominiumsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
