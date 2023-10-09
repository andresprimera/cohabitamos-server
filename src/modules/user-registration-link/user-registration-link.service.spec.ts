import { Test, TestingModule } from '@nestjs/testing';
import { UserRegistrationLinkService } from './user-registration-link.service';

describe('UserRegistrationLinkService', () => {
  let service: UserRegistrationLinkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRegistrationLinkService],
    }).compile();

    service = module.get<UserRegistrationLinkService>(UserRegistrationLinkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
