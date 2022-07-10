import { UseGuards } from "@nestjs/common";
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { FitbitGuard } from "../../middleware/fitbit.guard";
import { FitbitUser } from "../../middleware/fitbit.types";
import { User } from "../../middleware/user.decorator";
import { Sleep as SleepType } from "../../types/graphql";
import { SleepService } from "./sleep.service";

@UseGuards(FitbitGuard)
@Resolver("Sleep")
export class SleepResolver {
  constructor(private readonly sleepService: SleepService) {}

  @ResolveField()
  async score(@Parent() parent: SleepType) {
    return this.sleepService.getSleepScore({
      ...parent,
    });
  }

  @ResolveField()
  async variables(@Parent() parent: SleepType) {
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
    const sleep = await this.sleepService.addVariable(user.id, name, sleepDate);

    if (!sleep) {
      return [null];
    }

    return {
      date: sleep.date,
      variables: await this.sleepService.transformVariables(
        user.id,
        ...(sleep.variables ?? []),
      ),
    };
  }

  @Mutation()
  async removeSleepVariable(
    @User() user: FitbitUser,
    @Args("name") name: string,
    @Args("sleepDate") sleepDate: string,
  ) {
    const sleep = await this.sleepService.removeVariable(
      user.id,
      name,
      sleepDate,
    );
    if (!sleep) {
      return [null];
    }

    return {
      date: sleep.date,
      variables: await this.sleepService.transformVariables(
        user.id,
        ...(sleep.variables ?? []),
      ),
    };
  }

  @Query()
  async analyzeSleep(@User() user: FitbitUser) {
    this.sleepService.analyzeSleep(user.id, user.token) ?? true;
    return true;
  }
}
