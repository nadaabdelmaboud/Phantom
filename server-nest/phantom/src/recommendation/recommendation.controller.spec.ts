import { Test, TestingModule } from '@nestjs/testing';
import { RecommendationController } from './recommendation.controller';

describe('Recommendation Controller', () => {
  let controller: RecommendationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecommendationController],
    }).compile();

    controller = module.get<RecommendationController>(RecommendationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
