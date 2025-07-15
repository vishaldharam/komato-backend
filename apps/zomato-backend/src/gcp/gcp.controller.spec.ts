import { Test, TestingModule } from '@nestjs/testing';
import { GcpController } from './gcp.controller';

describe('GcpController', () => {
  let controller: GcpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GcpController],
    }).compile();

    controller = module.get<GcpController>(GcpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
