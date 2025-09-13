import { Test, TestingModule } from '@nestjs/testing';
import { EssayController } from './essay.controller';
import { EssayService } from './essay.service';

describe('EssayController', () => {
  let controller: EssayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EssayController],
      providers: [EssayService],
    }).compile();

    controller = module.get<EssayController>(EssayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
