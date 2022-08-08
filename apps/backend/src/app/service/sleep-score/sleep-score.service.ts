import { Injectable } from "@nestjs/common";
import { Numbers } from "@sprint/common";
import { readFileSync } from "fs";
import { PolynomialRegressor } from "regression-multivariate-polynomial";

@Injectable()
export class SleepScoreService {
  private polyModel: PolynomialRegressor;

  async onModuleInit() {
    this.polyModel = new PolynomialRegressor();
    this.polyModel.fromConfig(
      JSON.parse(
        readFileSync(`${__dirname}/assets/poly-model/model.json`, "utf8"),
      ),
    );
  }

  getSleepScore({
    awake,
    awakenings,
    deep,
    light,
    rem,
  }: {
    awake: number;
    rem: number;
    deep: number;
    light: number;
    awakenings: number;
  }) {
    return Numbers.clamp(
      this.polyModel.predict([[awake, awakenings, rem, light, deep]])[0][0],
      0,
      100,
      { round: true },
    );
  }
}
