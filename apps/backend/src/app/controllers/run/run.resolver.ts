import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { RunService } from "./run.service";

@Resolver("Run")
export class RunResolver {
  constructor(private readonly runService: RunService) {}

  @Mutation()
  async createRun(
    @Args("token") token: string,
    @Args("startDate") startDate: string,
    @Args("endDate") endDate: string,
    @Args("startTime") startTime: string,
    @Args("endTime") endTime: string,
    @Args("intensityFB") fb: number,
  ) {
    const intraDayActivity = this.runService.createRun(
      token,
      startDate,
      endDate,
      startTime,
      endTime,
    );
    const hrActivity = Object.values(intraDayActivity);

    const timeStart = new Date(startDate + "T" + startTime);
    const timeEnd = new Date(endDate + "T" + endTime);
    const durationMins = (timeEnd.getTime() - timeStart.getTime()) / 1000 / 60;

    const newRun = {
      userId: "",
      date: startDate,
      duration: durationMins,
      heartRate: hrActivity,
      vo2max: null,
      intensityFeedback: fb,
    };

    return newRun;
    //TODO: get userID, create run object, add run to user
  }
}
