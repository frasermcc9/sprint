import { Test, TestingModule } from "@nestjs/testing";
import { SleepService } from "./sleep.service";

describe("SleepService", () => {
  let service: SleepService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SleepService],
    }).compile();

    service = module.get<SleepService>(SleepService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
