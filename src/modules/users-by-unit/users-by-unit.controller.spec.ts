import { Test, TestingModule } from '@nestjs/testing';
import { UsersByUnitController } from './users-by-unit.controller';
import { UsersByUnitService } from './users-by-unit.service';

describe('UsersByUnitController', () => {
  let controller: UsersByUnitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersByUnitController],
      providers: [UsersByUnitService],
    }).compile();

    controller = module.get<UsersByUnitController>(UsersByUnitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
