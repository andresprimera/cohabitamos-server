import { Test, TestingModule } from '@nestjs/testing';
import { UserRegistrationLinkController } from './user-registration-link.controller';
import { UserRegistrationLinkService } from './user-registration-link.service';

describe('UserRegistrationLinkController', () => {
  let controller: UserRegistrationLinkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserRegistrationLinkController],
      providers: [UserRegistrationLinkService],
    }).compile();

    controller = module.get<UserRegistrationLinkController>(UserRegistrationLinkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
