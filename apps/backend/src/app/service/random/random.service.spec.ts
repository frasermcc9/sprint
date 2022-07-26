import { Test } from "@nestjs/testing";
import { RandomService } from "./random.service";

describe("Random Test suite", () => {
  let Service: RandomService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [RandomService],
    }).compile();

    Service = module.get<RandomService>(RandomService);
  });

  it("should be defined", () => {
    expect(Service).toBeDefined();
  });

  it("should produce an equivalent value for the same day for randomDateSeeded", () => {
    const date = new Date();
    const [rng1] = Service.randomDateSeeded(1, date);
    const [rng2] = Service.randomDateSeeded(1, date);

    expect(rng1).toEqual(rng2);
  });

  it("should produce different values for different dates for randomDateSeeded", () => {
    const date1 = new Date();
    const date2 = new Date();
    date2.setDate(date2.getDate() + 1);

    const [rng1] = Service.randomDateSeeded(1, date1);
    const [rng2] = Service.randomDateSeeded(1, date2);

    expect(rng1).not.toEqual(rng2);
  });

  it("Generating multiple numbers produces random results but different", () => {
    const date = new Date();

    const [rng1, rng2] = Service.randomDateSeeded(2, date);
    const [rng3, rng4] = Service.randomDateSeeded(2, date);

    expect(rng1).not.toEqual(rng2);
    expect(rng3).not.toEqual(rng4);

    expect(rng1).toEqual(rng3);
    expect(rng2).toEqual(rng4);
  });

  it("Default date argument will default to the current day", () => {
    const date = new Date();

    const [rng1] = Service.randomDateSeeded(1);
    const [rng2] = Service.randomDateSeeded(1, date);

    expect(rng1).toEqual(rng2);
  });
});
