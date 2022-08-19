import { UseGuards } from "@nestjs/common";
import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { FitbitGuard } from "../../middleware/fitbit.guard";
import { FitbitUser } from "../../middleware/fitbit.types";
import { User } from "../../middleware/user.decorator";
import { RunService } from "./run.service";

@Resolver("Run")
@UseGuards(FitbitGuard)
export class RunResolver {
  constructor(private readonly runService: RunService) {}

  @Mutation()
  async createRun(
    @User() user: FitbitUser,
    @Args("startDate") startDate: string,
    @Args("endDate") endDate: string,
    @Args("startTime") startTime: string,
    @Args("endTime") endTime: string,
    @Args("intensity") fb: number,
  ) {
    return this.runService.createRun(
      user.id,
      user.token,
      startDate,
      endDate,
      startTime,
      endTime,
      fb,
    );
  }

  @Mutation()
  async resyncRun(
    @User() user: FitbitUser,
    @Args("startDate") startDate: string,
    @Args("startTime") startTime: string,
    @Args("duration") duration: number,
    @Args("intensity") fb: number,
  ) {
    return this.runService.resyncRun(
      user.id,
      user.token,
      startDate,
      startTime,
      duration,
      fb,
    );
  }
}
