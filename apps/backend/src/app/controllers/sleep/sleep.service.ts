import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as tf from "@tensorflow/tfjs-node";
import { User, UserCollection } from "../../db/schema/user.schema";
import { Sleep } from "../../types/graphql";

@Injectable()
export class SleepService {
  private model: tf.LayersModel;

  constructor(
    @InjectModel(User.name) private readonly userModel: UserCollection,
  ) {}

  async onModuleInit() {
    this.model = await tf.loadLayersModel(
      `file://${__dirname}/assets/sleep-model/model.json`,
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
    const prediction = this.model.predict(
      tf.tensor([awake, awakenings, rem, light, deep], [1, 5]),
    );

    if (Array.isArray(prediction)) {
      return Math.round(Array.from(prediction[0].dataSync())[0]);
    }
    return Math.round(Array.from(prediction.dataSync())[0]);
  }

  async setVariables(id: string, variables: string[], sleepDate: string) {
    const user = await this.userModel.findOne({ id });
    if (!user) return null;

    const sleep = user.sleeps?.find((s) => s.date === sleepDate);
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

    const sleep = user.sleeps?.find((s) => s.date === forSleep.date);
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

  async removeVariable(id: string, name: string, sleepDate: string) {
    const user = await this.userModel.findOne({ id });
    if (!user) return null;

    const sleep = user.sleeps?.find((s) => s.date === sleepDate);
    if (!sleep) return null;

    const index = sleep.variables?.indexOf(name) ?? -1;
    if (index === -1) return null;

    sleep.variables?.splice(index, 1);

    user.markModified("sleeps");
    user.markModified("sleeps.variables");

    await user.save();
  }

  async addVariable(id: string, name: string, sleepDate: string) {
    const user = await this.userModel.findOne({ id });
    if (!user) return false;

    const sleep = user.sleeps?.find((s) => s.date === sleepDate);
    if (!sleep || !sleep.variables) return false;

    const exists = sleep.variables.includes(name);
    if (!exists) {
      sleep.variables.push(name);

      user.markModified("sleeps");
      user.markModified("sleeps.variables");

      await user.save();

      return true;
    }

    return false;
  }
}
