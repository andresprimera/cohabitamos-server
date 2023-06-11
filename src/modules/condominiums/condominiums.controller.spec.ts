import { Test, TestingModule } from '@nestjs/testing';
import { CondominiumsController } from './condominiums.controller';
import { CondominiumsService } from './condominiums.service';

describe('CondominiumsController', () => {
  let controller: CondominiumsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CondominiumsController],
      providers: [CondominiumsService],
    }).compile();

    controller = module.get<CondominiumsController>(CondominiumsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
