import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Run, RunCollection } from "../../db/schema/run.schema";
import { calculateVO2max } from "../../service/run-processing/runProcessing";

@Injectable()
export class RunService {
  constructor(
    @InjectModel(Run.name) private readonly runModel: RunCollection,
  ) {}

  getRun(userId: string) {
    return this.runModel.findOne({ userId });
  }

  /**
   * Fetch activity heart rate series from Fitbit API
   * @param token Fitbit access token
   * @param dateStart date in format YYYY-MM-DD
   * @param dateEnd date in format YYYY-MM-DD
   */
  async createRun(
    userID: string,
    maxHR: number,
    access_token: string,
    dateStart: string,
    dateEnd: string,
    startTime: string,
    endTime: string,
    intensityFB: number,
  ) {
    try {
      const res = await fetch(
        `https://api.fitbit.com/1/user/-/activities/heart/date/${dateStart}/${dateEnd}/1min/time/${startTime}/${endTime}.json1`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${access_token}` },
        },
      );
      const data = await res.json();
      const hrActivity = Object.values(data);

      const timeStart = new Date(dateStart + "T" + startTime);
      const timeEnd = new Date(dateEnd + "T" + endTime);
      const durationMins =
        (timeEnd.getTime() - timeStart.getTime()) / 1000 / 60;

      const vo2Max = calculateVO2max(data, maxHR);

      const newRun = {
        userId: userID,
        date: dateStart,
        duration: durationMins,
        heartRate: hrActivity,
        vo2max: vo2Max,
        intensityFeedback: intensityFB,
      };

      this.runModel.create(newRun);
      return newRun;
    } catch (e) {
      console.error(e.toJSON());
    }
  }
}
