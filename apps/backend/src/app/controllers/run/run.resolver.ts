import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { RunService } from "./run.service";

@Resolver("Run")
export class RunResolver {
  constructor(private readonly runService: RunService) {}

  @Mutation()
  async createRun(
    @Args("userId") userId: string,
    @Args("maxHR") maxHR: number,
    @Args("token") token: string,
    @Args("startDate") startDate: string,
    @Args("endDate") endDate: string,
    @Args("startTime") startTime: string,
    @Args("endTime") endTime: string,
    @Args("intensityFB") fb: number,
  ) {
    return this.runService.createRun(
      userId,
      maxHR,
      token,
      startDate,
      endDate,
      startTime,
      endTime,
      fb,
    );

    //TODO: get userID, create run object, add run to user
  }
}
