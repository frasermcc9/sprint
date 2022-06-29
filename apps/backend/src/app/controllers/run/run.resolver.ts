import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
// import { Run as GQLRun } from "../../types/graphql";
import { RunService } from "./run.service";

@Resolver("Run")
export class RunResolver {
  constructor(private readonly runService: RunService) {}

  @Mutation()
  async createRun(
    @Args("token") token: string,
    @Args("startDate") startDate: string,
    @Args("endDate") endDate: string,
  ) {
    return this.runService.createRun(token, startDate, endDate);
  }
}
