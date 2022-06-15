import { Test, TestingModule } from "@nestjs/testing";
import { ScienceResolver } from "./science.resolver";
import { ScienceService } from "./science.service";

describe("ScienceResolver", () => {
  let resolver: ScienceResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScienceResolver, ScienceService],
    }).compile();

    resolver = module.get<ScienceResolver>(ScienceResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
