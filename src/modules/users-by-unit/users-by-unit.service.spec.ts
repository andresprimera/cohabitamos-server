import { Test, TestingModule } from '@nestjs/testing';
import { UsersByUnitService } from './users-by-unit.service';

describe('UsersByUnitService', () => {
  let service: UsersByUnitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersByUnitService],
    }).compile();

    service = module.get<UsersByUnitService>(UsersByUnitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
