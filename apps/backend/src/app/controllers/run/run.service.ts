import { Injectable } from "@nestjs/common";
import { Int } from "@nestjs/graphql";
import { InjectModel } from "@nestjs/mongoose";
import { Run, RunCollection } from "../../db/schema/run.schema";
import { UserCollection } from "../../db/schema/user.schema";
import { User } from "../../middleware/user.decorator";
import { calculateVO2max } from "../../service/run-processing/runProcessing";

@Injectable()
export class RunService {
  constructor(
    @InjectModel(Run.name) private readonly runModel: RunCollection,
    @InjectModel(User.name) private readonly userModel: UserCollection,
  ) {}

  getRun(userId: string) {
    return this.runModel.findOne({ userId });
  }

  /**
   * Fetch activity heart rate series from Fitbit API
   * @param fitbitId Fitbit user ID
   * @param access_token Fitbit access token
   * @param dateStart date in format YYYY-MM-DD
   * @param dateEnd date in format YYYY-MM-DD
   * @param timeStart time in format HH:MM
   * @param timeEnd time in format HH:MM
   * @param intensityFB intensity feedback from User
   */
  async createRun(
    fitbitId: string,
    access_token: string,
    dateStart: string,
    dateEnd: string,
    startTime: string,
    endTime: string,
    intensityFB: number,
  ) {
    interface data {
      activitiesHeart: {
        customHeartRateZones: [];
        dateTime: string;
        heartRateZones: {
          caloriesOut: number;
          max: number;
          min: number;
          minutes: number;
          name: string;
        }[];
        value: number;
      }[];
      activitiesHeartIntraday: {
        dataset: {
          time: string;
          value: number;
        }[];
        datasetInterval: number;
        datasetType: string;
      }[];
    }

    const dbUser = await this.userModel.findOne({ id: fitbitId });
    if (!dbUser) {
      throw new Error("User not found");
    }

    try {
      const res = await fetch(
        `https://api.fitbit.com/1/user/-/activities/heart/date/${dateStart}/${dateEnd}/1min/time/${startTime}/${endTime}.json1`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${access_token}` },
        },
      );
      const data: data = await res.json();

      // Logic is tested and works, but error "No overload matches this call."
      if (!res.ok || !data) {
        throw new Error("No data");
      }

      const dataset = Object.values(data)[1];
      const dataset2 = Object.values(dataset)[0];
      const hrActivityList: number[] = [];
      dataset2.forEach((element) => hrActivityList.push(element.value));

      const timeStart = new Date(dateStart + "T" + startTime);
      const timeEnd = new Date(dateEnd + "T" + endTime);
      const durationMins =
        (timeEnd.getTime() - timeStart.getTime()) / 1000 / 60;

      const vo2Max = calculateVO2max(hrActivityList, dbUser.maxHR);

      const newRun = {
        userId: dbUser.id,
        date: dateStart,
        duration: durationMins,
        heartRate: hrActivityList,
        vo2max: vo2Max,
        intensityFeedback: intensityFB,
      };

      this.runModel.create(newRun);

      dbUser.runs?.push(newRun);
      dbUser.save();

      return newRun;
    } catch (e) {
      console.error(e.toJSON());
    }
  }
}
