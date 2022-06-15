import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { FitbitGuard } from "../../middleware/fitbit.guard";
import { FitbitUser } from "../../middleware/fitbit.types";
import { User } from "../../middleware/user.decorator";
import { ScienceService } from "./science.service";

@Resolver("Science")
@UseGuards(FitbitGuard)
export class ScienceResolver {
  constructor(private readonly scienceService: ScienceService) {}

  @Mutation()
  async createEvent(
    @User() user: FitbitUser,
    @Args("event") event: string,
    @Args("payload") payload: string,
  ) {
    const document = await this.scienceService.createEvent(
      user.id,
      event,
      payload,
    );

    return document;
  }
}
