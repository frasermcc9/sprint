import { Test, TestingModule } from "@nestjs/testing";
import { SleepResolver } from "./sleep.resolver";
import { SleepService } from "./sleep.service";

describe("SleepResolver", () => {
  let resolver: SleepResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SleepResolver, SleepService],
    }).compile();

    resolver = module.get<SleepResolver>(SleepResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
