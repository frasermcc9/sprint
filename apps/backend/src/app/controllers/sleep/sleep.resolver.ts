import { UseGuards } from "@nestjs/common";
import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { FitbitGuard } from "../../middleware/fitbit.guard";
import { FitbitUser } from "../../middleware/fitbit.types";
import { User } from "../../middleware/user.decorator";
import { Sleep } from "../../types/graphql";
import { SleepService } from "./sleep.service";

@Resolver("Sleep")
@UseGuards(FitbitGuard)
export class SleepResolver {
  constructor(private readonly sleepService: SleepService) {}

  @ResolveField()
  async score(@Parent() parent: Sleep) {
    return this.sleepService.getSleepScore({
      ...parent,
    });
  }

  @ResolveField()
  async variables(@Parent() parent: Sleep) {
    return this.sleepService.getVariables(parent);
  }

  @Mutation()
  async addSleepVariable(
    @User() user: FitbitUser,
    @Args("name") name: string,
    @Args("emoji") emoji: string,
    @Args("custom") custom: boolean,
    @Args("sleepDate") sleepDate: string,
  ) {
    const found = await this.sleepService.addVariable(user.id, name, sleepDate);
    if (!found) return null;

    return {
      name,
      emoji,
      custom,
    };
  }

  @Mutation()
  async removeSleepVariable(
    @User() user: FitbitUser,
    @Args("name") name: string,
    @Args("sleepDate") sleepDate: string,
  ) {
    await this.sleepService.removeVariable(user.id, name, sleepDate);

    return name;
  }
}
