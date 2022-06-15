import { Test, TestingModule } from "@nestjs/testing";
import { ScienceService } from "./science.service";

describe("ScienceService", () => {
  let service: ScienceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScienceService],
    }).compile();

    service = module.get<ScienceService>(ScienceService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
