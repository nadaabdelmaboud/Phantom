import { Test, TestingModule } from '@nestjs/testing';
import { PinsController } from './pins.controller';

describe('Pins Controller', () => {
  let controller: PinsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PinsController],
    }).compile();

    controller = module.get<PinsController>(PinsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
