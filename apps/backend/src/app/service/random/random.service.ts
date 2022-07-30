import { Injectable } from "@nestjs/common";
import { Dates, Tuple } from "@sprint/common";
import { create } from "random-seed";

@Injectable()
export class RandomService {
  /**
   * Will produce a random number between 0 and 1, that is the same for every
   * call on the same day.
   *
   * @param forDate The date to generate the random number for, default today
   * @returns The random number
   */
  randomDateSeeded<T extends number>(
    count: T | number = 1,
    forDate = new Date(),
  ): Tuple<number, T> {
    const dateBase = Dates.stripTime(forDate);
    const randomDateSeed = create(dateBase.getTime() + "");

    return new Array(count).fill(0).map(() => randomDateSeed.random()) as Tuple<
      number,
      T
    >;
  }
}
