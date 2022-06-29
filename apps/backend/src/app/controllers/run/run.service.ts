import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Run, RunCollection } from "../../db/schema/run.schema";

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
  async createRun(access_token: string, dateStart: string, dateEnd: string) {
    try {
      fetch(
        "https://api.fitbit.com/1/user/-/activities/heart/date/" +
          dateStart +
          "/" +
          dateEnd +
          "/1min.json",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${access_token}` },
        },
      )
        .then((res) => res.json())
        .then((json) => console.log(json));
    } catch (e) {
      console.error(e.toJSON());
    }
  }
}
