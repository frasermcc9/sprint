import { UseGuards } from "@nestjs/common";
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { calculateMaxHr, Feature, isValidEmblem } from "@sprint/common";
import { User as UserModel } from "../../db/schema/user.schema";
import { FitbitGuard } from "../../middleware/fitbit.guard";
import { FitbitUser } from "../../middleware/fitbit.types";
import { DBUser, User } from "../../middleware/user.decorator";
import { formatDuration } from "../../service/run-processing/run-duration";
import { calculateNewParams } from "../../service/run-processing/runProcessing";
import {
  AccountStage,
  ExperienceLevel,
  PublicUser,
  Sleep,
  SleepVariable,
  User as GQLUser,
} from "../../types/graphql";
import { UserService } from "./user.service";

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

    if (!dbUser.currentRunParams) {
      return null;
    }

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
    @Args("avatarUrl") avatarUrl: string,
  ) {
    const dbUser = await this.userService.getUser(user.id);

    dbUser.avatarUrl = avatarUrl;

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
    if (!dbUser) return null;

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
    if (!dbUser || !dbUser.currentRunParams) return null;

    const currentParams = dbUser.currentRunParams;
    const newParams = calculateNewParams(currentParams, intensityFeedback);

    dbUser.currentRunParams = newParams;

    return await dbUser?.save();
  }

  @Mutation()
  async createSleepVariable(
    @User() user: FitbitUser,
    @Args("name") name: string,
    @Args("emoji") emoji: string,
  ) {
    const dbUser = await this.userService.getUser(user.id);
    if (!dbUser) return null;

    dbUser.sleepVariables?.push({
      name,
      emoji,
    });

    dbUser.markModified("sleepVariables");
    await dbUser.save();

    return {
      name,
      emoji,
      custom: true,
    };
  }

  @Mutation()
  async updateEmblem(@User() user: FitbitUser, @Args("emblem") emblem: string) {
    const dbUser = await this.userService.getUser(user.id);

    if (isValidEmblem(emblem) && dbUser.unlockedEmblems.includes(emblem)) {
      dbUser.emblem = emblem;
      await dbUser.save();
    } else {
      return dbUser.emblem;
    }

    return emblem;
  }

  @ResolveField()
  async maxHr(@Parent() user: FitbitUser): Promise<number> {
    const dbUser = await this.userService.getUser(user.id);
    return calculateMaxHr(dbUser?.dob);
  }

  @ResolveField()
  async runs(@Parent() user: FitbitUser) {
    const dbUser = await this.userService.getUser(user.id);
    return dbUser?.runs ?? [];
  }

  @ResolveField()
  async emblem(@DBUser() user: UserModel) {
    return user.emblem;
  }

  @ResolveField()
  async availableEmblems(@DBUser() user: UserModel) {
    return user.unlockedEmblems;
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
  async todaysSleep(
    @User() user: FitbitUser,
    @Args("sourceUrl") sourceUrl: string | null,
  ): Promise<Partial<Sleep>[] | null> {
    const sleepToday = await this.userService.getSleepData(user, {
      srcUrl: sourceUrl,
    });

    if (!sleepToday) return [];

    return [
      {
        ...sleepToday,
        ownerId: user.id,
      },
    ];
  }

  @ResolveField()
  async sleepVariables(
    @User() user: FitbitUser,
  ): Promise<Partial<SleepVariable>[]> {
    const dbUser = await this.userService.getUser(user.id);
    return dbUser?.sleepVariables?.map((v) => ({ ...v, custom: true })) ?? [];
  }

  @ResolveField()
  async trackedVariables(@User() user: FitbitUser) {
    const dbUser = await this.userService.getUser(user.id);
    return dbUser?.trackedVariables ?? [];
  }
}
