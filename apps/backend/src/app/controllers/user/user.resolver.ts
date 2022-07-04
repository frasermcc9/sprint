import { UseGuards } from "@nestjs/common";
import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from "@nestjs/graphql";
import { calculateMaxHr, Feature } from "@sprint/common";
import { calculateNewParams } from "../../service/run-processing/runProcessing";
import { FitbitGuard } from "../../middleware/fitbit.guard";
import { FitbitUser } from "../../middleware/fitbit.types";
import { User } from "../../middleware/user.decorator";
import {
  AccountStage,
  ExperienceLevel,
  PublicUser,
  User as GQLUser,
} from "../../types/graphql";
import { UserService } from "./user.service";
import { formatDuration } from "../../service/run-processing/run-duration";

@Resolver("User")
@Resolver("PublicUser")
@UseGuards(FitbitGuard)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query()
  async currentUser(@User() user: FitbitUser): Promise<Partial<GQLUser>> {
    const dbUser = await this.userService.getUser(user.id);

    return {
      id: dbUser.id,
      firstName: dbUser.firstName,
      lastName: dbUser.lastName,
      experience: dbUser.experience,
      stage: dbUser.stage,
      dob: dbUser.dob,
      defaultRunDuration: dbUser.defaultRunDuration,
      features: dbUser.featuresSeen,
      createdAtUTS: dbUser.createdAtUTS,
      avatarUrl: dbUser.avatarUrl,
      utcOffset: dbUser.utcOffset,
      xp: dbUser.xp,
      currentRunParams: dbUser.currentRunParams,
    };
  }

  @Query()
  async prepRun(@User() user: FitbitUser, @Args("duration") duration: number) {
    const dbUser = await this.userService.getUser(user.id);
    return formatDuration(dbUser.currentRunParams, duration);
  }

  @Mutation()
  async completeOnboarding(
    @User() user: FitbitUser,
    @Args("experience") experience: ExperienceLevel,
    @Args("firstName") firstName: string,
    @Args("lastName") lastName: string,
    @Args("dob") dob: string,
  ) {
    const dbUser = await this.userService.getUser(user.id);

    dbUser.experience = experience;
    dbUser.firstName = firstName;
    dbUser.lastName = lastName;
    dbUser.stage = AccountStage.EXPERIENCE_LEVEL_SELECTED;
    dbUser.dob = dob;

    switch (experience) {
      case ExperienceLevel.BEGINNER:
        dbUser.currentRunParams = {
          highIntensity: 25,
          lowIntensity: 35,
          repetitions: 3,
          sets: 3,
          restPeriod: 120,
        };
        break;
      case ExperienceLevel.INTERMEDIATE:
        dbUser.currentRunParams = {
          highIntensity: 30,
          lowIntensity: 30,
          repetitions: 3,
          sets: 3,
          restPeriod: 120,
        };
        break;
      case ExperienceLevel.ADVANCED:
        dbUser.currentRunParams = {
          highIntensity: 35,
          lowIntensity: 25,
          repetitions: 3,
          sets: 3,
          restPeriod: 120,
        };
        break;
    }

    return await dbUser.save();
  }

  @Mutation()
  async updateProfile(
    @User() user: FitbitUser,
    @Args("firstName") firstName: string,
    @Args("lastName") lastName: string,
    @Args("dob") dob: string,
  ) {
    const dbUser = await this.userService.getUser(user.id);

    dbUser.firstName = firstName;
    dbUser.lastName = lastName;
    dbUser.dob = dob;

    return await dbUser.save();
  }

  @Mutation()
  async updateProfilePic(
    @User() user: FitbitUser,
    @Args("photoUrl") photoUrl: string,
  ) {
    const dbUser = await this.userService.getUser(user.id);

    dbUser.avatarUrl = photoUrl;

    return await dbUser.save();
  }

  @Mutation()
  async updateDefaultRunDuration(
    @User() user: FitbitUser,
    @Args("duration") duration: number,
  ) {
    const dbUser = await this.userService.getUser(user.id);
    dbUser.defaultRunDuration = duration;
    await dbUser.save();

    return duration;
  }

  @Mutation()
  async markFeatureSeen(
    @User() user: FitbitUser,
    @Args("feature") feature: Feature,
  ) {
    const dbUser = await this.userService.getUser(user.id);
    dbUser.featuresSeen = dbUser.featuresSeen ?? [];
    if (!dbUser.featuresSeen.includes(feature)) {
      dbUser.featuresSeen.push(feature);
      dbUser.markModified("featuresSeen");
      await dbUser.save();
    }

    return dbUser.featuresSeen;
  }

  @Mutation()
  async sendFriendRequest(
    @User() user: FitbitUser,
    @Args("friendId") friendId: string,
  ) {
    if (await this.userService.sendFriendRequest(user.id, friendId)) {
      return true;
    }
  }

  @Mutation()
  async acceptFriendRequest(
    @User() user: FitbitUser,
    @Args("friendId") friendId: string,
  ) {
    return this.userService.acceptFriendRequest(user.id, friendId);
  }

  @Mutation()
  async rejectFriendRequest(
    @User() user: FitbitUser,
    @Args("friendId") friendId: string,
  ) {
    return this.userService.rejectFriend(user.id, friendId);
  }

  @Mutation()
  async updateRunParams(
    @User() user: FitbitUser,
    @Args("intensityFeedback") intensityFeedback: number,
  ) {
    const dbUser = await this.userService.getUser(user.id);
    const currentParams = dbUser.currentRunParams;
    const newParams = calculateNewParams(currentParams, intensityFeedback);

    dbUser.currentRunParams = newParams;

    return await dbUser.save();
  }

  @ResolveField()
  async maxHr(@Parent() user: FitbitUser): Promise<number> {
    const dbUser = await this.userService.getUser(user.id);
    return calculateMaxHr(dbUser.dob);
  }

  @ResolveField()
  async runs(@Parent() user: FitbitUser) {
    const dbUser = await this.userService.getUser(user.id);
    return dbUser.runs ?? [];
  }

  @ResolveField()
  async friends(
    @Parent() user: FitbitUser,
    @Args("limit") limit: number,
  ): Promise<Partial<PublicUser>[]> {
    return this.userService.findFriends(user.id, limit);
  }

  @ResolveField()
  async friendRequests(@Parent() user: FitbitUser) {
    return this.userService.getFriendRequests(user.id);
  }

  @ResolveField()
  async todaysSleep(@User() user: FitbitUser): Promise<unknown> {
    const sleepToday = await this.userService.getSleepData(user.token);

    if (sleepToday.sleep.length === 0) {
      return null;
    }

    const mainSleep = sleepToday.sleep.find((s) => s.isMainSleep);
    if (!mainSleep) {
      return null;
    }

    const {
      levels: {
        summary: { deep, light, rem, wake },
      },
    } = mainSleep;

    const score = this.userService.getSleepScore({
      awake: wake.minutes,
      rem: rem.minutes,
      awakenings: wake.count,
      deep: deep.minutes,
      light: light.minutes,
    });

    return {
      rem: rem.minutes,
      light: light.minutes,
      awake: wake.minutes,
      deep: deep.minutes,
      awakenings: wake.count,
      score,
    };
  }
}
