import { Test, TestingModule } from "@nestjs/testing";
import { RunResolver } from "./run.resolver";
import { RunService } from "./run.service";

describe("UserResolver", () => {
  let resolver: RunResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RunResolver, RunService],
    }).compile();

    resolver = module.get<RunResolver>(RunResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
