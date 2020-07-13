import { Test, TestingModule } from '@nestjs/testing';
import { PinsService } from './pins.service';

describe('PinsService', () => {
  let service: PinsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PinsService],
    }).compile();

    service = module.get<PinsService>(PinsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
