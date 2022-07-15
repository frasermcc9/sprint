import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Numbers, Sleep as SleepCommon } from "@sprint/common";
import { readFileSync } from "fs";
import { HttpService } from "nestjs-http-promise";
import {
  User,
  UserCollection,
  UserDocument,
} from "../../db/schema/user.schema";
import { Sleep } from "../../types/graphql";
import { SleepRangeResponse } from "./interfaces/sleep-range.interface";
import { PolynomialRegressor } from "regression-multivariate-polynomial";

@Injectable()
export class SleepService {
  private polyModel: PolynomialRegressor;

  constructor(
    @InjectModel(User.name) private readonly userModel: UserCollection,
    private readonly httpService: HttpService,
  ) {}

  async onModuleInit() {
    this.polyModel = new PolynomialRegressor();
    this.polyModel.fromConfig(
      JSON.parse(
        readFileSync(`${__dirname}/assets/poly-model/model.json`, "utf8"),
      ),
    );
  }

  async findUser(id: string) {
    return await this.userModel.findOne({ id });
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

  async setVariables(id: string, variables: string[], sleepDate: string) {
    const user = await this.userModel.findOne({ id });
    if (!user) return null;

    const sleep = this.findSleep(user, sleepDate);
    if (!sleep) return null;

    sleep.variables = variables;
    user.markModified("sleeps");
    user.markModified("sleeps.variables");

    await user.save();

    return variables;
  }

  async getVariables(forSleep: Sleep) {
    const user = await this.userModel.findOne({ id: forSleep.ownerId });

    if (!user) return [];

    const sleep = this.findSleep(user, forSleep.date);
    if (!sleep) return [];

    const customVariables = user.sleepVariables;

    return sleep?.variables?.map((v) => {
      const custom = customVariables?.find((cv) => cv.name === v);
      if (custom) {
        return {
          name: v,
          custom: true,
          emoji: custom.emoji,
        };
      } else {
        return {
          name: v,
          custom: false,
        };
      }
    });
  }

  findSleep(user: UserDocument, date: string) {
    return user.sleeps?.get(date);
  }

  async removeVariable(id: string, name: string, sleepDate: string) {
    const user = await this.userModel.findOne({ id });
    if (!user) return null;

    const sleep = this.findSleep(user, sleepDate);
    if (!sleep) return null;

    const index = sleep.variables?.indexOf(name) ?? -1;
    if (index === -1) return sleep;

    sleep.variables?.splice(index, 1);

    user.markModified("sleeps");
    user.markModified("sleeps.variables");

    await user.save();

    return sleep;
  }

  async addVariable(id: string, name: string, sleepDate: string) {
    const user = await this.userModel.findOne({ id });
    if (!user) return null;

    const sleep = this.findSleep(user, sleepDate);
    if (!sleep || !sleep.variables) return null;

    const exists = sleep.variables.includes(name);
    if (!exists) {
      sleep.variables.push(name);

      user.markModified("sleeps");
      user.markModified("sleeps.variables");

      await user.save();
    }
    return sleep;
  }

  async transformVariables(userId: string, ...variables: string[]) {
    return Promise.all(
      variables.map(async (v) => {
        const custom = SleepCommon.defaultVariables.find((dv) => dv.name === v)
          ? false
          : true;
        return {
          name: v,
          custom,
          emoji: custom
            ? (await this.findUser(userId))?.sleepVariables?.find(
                (uv) => uv.name === v,
              )?.emoji
            : null,
        };
      }),
    );
  }

  async analyzeSleep(userId: string, bearer: string) {
    const dbUser = await this.userModel.findOne({ id: userId });
    if (!dbUser) return null;

    const dbSleeps = dbUser?.sleeps;

    const oldestSleep = dbUser.earliestSleep();
    const newestSleep = dbUser.latestSleep();
    if (!oldestSleep || !newestSleep || !dbSleeps) return null;

    try {
      const { data } = await this.httpService.get<SleepRangeResponse>(
        `https://api.fitbit.com/1.2/user/-/sleep/date/${oldestSleep.date}/${newestSleep.date}.json`,
        {
          headers: {
            Authorization: `Bearer ${bearer}`,
          },
        },
      );

      const sleepData = data.sleep;

      const findSleep = (date: string) => {
        return sleepData.find((s) => s.dateOfSleep === date);
      };

      const sleepScoresAndVars = Array.from(dbSleeps.values()).flatMap(
        (sleep) => {
          const sleepData = findSleep(sleep.date);
          if (!sleepData) return [];

          const scoreDiscriminants = {
            awake: sleepData.levels.summary.wake.minutes,
            deep: sleepData.levels.summary.deep.minutes,
            light: sleepData.levels.summary.light.minutes,
            rem: sleepData.levels.summary.rem.minutes,
            awakenings: sleepData.levels.summary.wake.count,
          };

          const score = this.getSleepScore({ ...scoreDiscriminants });

          return {
            ...sleep,
            score,
            variables: sleep.variables ?? [],
          };
        },
      );

      const scoreAverage =
        sleepScoresAndVars.reduce((a, c) => a + c.score, 0) /
        sleepScoresAndVars.length;

      const variableIndex = [...new Set(dbUser.trackedVariables)];
      const variableCount = variableIndex.length;

      const variableMap: { [key: string]: number } = {};
      for (let i = 0; i < variableCount; i++) {
        variableMap[variableIndex[i]] = i;
      }

      const createArray = (variables: string[]) => {
        const array = new Array<number>(variableCount).fill(0);
        for (const variable of variables) {
          array[variableMap[variable]] = 1;
        }
        return array;
      };

      const inputMatrix: number[][] = [];
      const outputMatrix: number[][] = [];

      for (const sleep of sleepScoresAndVars) {
        const input = createArray(sleep.variables);
        inputMatrix.push(input);
        outputMatrix.push([sleep.score]);
      }

      const model = new PolynomialRegressor(1);
      model.fit(inputMatrix, outputMatrix);

      const weights = model.weights.slice(0, variableCount);
      const regressionIntercept = model.weights[variableCount][0];

      const components = weights.map((weight, index) => ({
        regressionGradient: weight[0],
        variable: variableIndex[index],
      }));

      return {
        components,
        regressionIntercept,
        scoreAverage,
      };
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException("Error when getting sleep range");
    }
  }
}
