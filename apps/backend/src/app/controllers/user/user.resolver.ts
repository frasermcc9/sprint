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
import { Run } from "../../db/schema/run.schema";
import { UserDocument } from "../../db/schema/user.schema";
import { FitbitGuard } from "../../middleware/fitbit.guard";
import { FitbitUser } from "../../middleware/fitbit.types";
import { DBUser, User } from "../../middleware/user.decorator";
import { GoalsService } from "../../service/goals/goals.service";
import { formatDuration } from "../../service/run-processing/run-duration";
import { calculateNewParams } from "../../service/run-processing/runProcessing";
import { generateFeedback } from "../../service/run-processing/fuzzyFeedback";
import {
  AccountStage,
  ExperienceLevel,
  InRun,
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
  constructor(
    private readonly userService: UserService,
    private readonly goalsService: GoalsService,
  ) {}

  @Query()
  async currentUser(@User() user: FitbitUser): Promise<Partial<GQLUser>> {
    const dbUser = await this.userService.getUser(user.id);

    return {
      id: dbUser.id,
      firstName: dbUser.firstName,
      lastName: dbUser.lastName,
      experience: dbUser.experience,
      stage: dbUser.stage,
      runs: dbUser.runs,
      dob: dbUser.dob,
      defaultRunDuration: dbUser.defaultRunDuration,
      features: dbUser.featuresSeen,
      createdAtUTS: dbUser.createdAtUTS,
      avatarUrl: dbUser.avatarUrl,
      utcOffset: dbUser.utcOffset,
      xp: dbUser.xp,
      currentRunParams: dbUser.currentRunParams,
      inRun: dbUser.inRun,
      nextRunStart: dbUser.nextRunStart,
      nextRunEnd: dbUser.nextRunEnd,
      runTrackStreak: dbUser.runTrackStreak,
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

  @Query()
  async generateRunFeedback(@User() user: FitbitUser, @Args("run") run: Run) {
    const dbUser = await this.userService.getUser(user.id);
    return generateFeedback(dbUser.maxHR, [run]);
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

    dbUser.markModified("currentRunParams");
    dbUser.currentRunParams = newParams;
    dbUser.lastIntensityFeedback = intensityFeedback;

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

  @Mutation()
  async updateInRun(@User() user: FitbitUser, @Args("inRun") inRun: InRun) {
    const dbUser = await this.userService.getUser(user.id);
    if (!dbUser) return null;

    dbUser.inRun = inRun;
    return await dbUser?.save();
  }

  @Mutation()
  async updateNextRunTimes(
    @User() user: FitbitUser,
    @Args("nextRunStart") nextRunStart: string,
    @Args("nextRunEnd") nextRunEnd: string,
  ) {
    const dbUser = await this.userService.getUser(user.id);
    if (!dbUser) return null;

    dbUser.nextRunStart = nextRunStart;
    dbUser.nextRunEnd = nextRunEnd;
    return await dbUser?.save();
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
  async emblem(@DBUser() user: UserDocument) {
    return user.emblem;
  }

  @ResolveField()
  async availableEmblems(@DBUser() user: UserDocument) {
    return user.unlockedEmblems;
  }

  @ResolveField()
  async friends(
    @Parent() user: FitbitUser,
    @Args("limit") limit: number,
  ): Promise<Partial<PublicUser>[]> {
    const friends = await this.userService.findFriends(user.id, limit);

    const f = friends.map((friend) => ({
      ...friend.toObject(),
      shareableSleepScore: this.getShareableSleepScore(friend),
    }));

    return f;
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

  @ResolveField()
  async dailyGoals(@User() user: FitbitUser, @DBUser() dbUser: UserDocument) {
    const goals = this.goalsService.getDailyGoals();
    let modified = false;
    const goalStates = await Promise.all(
      goals.map(async (g) => {
        const goalState = await dbUser.getGoal({ name: g.name });
        modified ||= goalState.modified;
        return {
          ...g,
          completed: goalState.amount,
        };
      }),
    );

    if (modified) {
      await dbUser.save();
    }

    return goalStates;
  }

  @ResolveField()
  async shareableSleepScore(@Parent() parent: Partial<GQLUser>) {
    if (!parent.id) {
      console.error("ShareableSleepScore: ID Required");
      return 0;
    }

    const user = await this.userService.getUser(parent.id);
    return this.getShareableSleepScore(user);
  }

  private getShareableSleepScore(user: UserDocument): number {
    const sleeps = user.latestSleep(7);

    if (!sleeps) {
      return 0;
    }

    const mostRecent = sleeps[0];
    const dateOfMostRecent = new Date(mostRecent.date);
    const monthBefore = new Date(
      dateOfMostRecent.setDate(dateOfMostRecent.getDate() - 30),
    );

    const filteredSleeps = sleeps
      .filter((s) => new Date(s.date) > monthBefore)
      .map((s) => s.score ?? 0);

    const currentLen = filteredSleeps.length;
    filteredSleeps.length = 7;
    filteredSleeps.fill(0, currentLen);

    return Math.round(filteredSleeps.reduce((a, b) => a + b, 0) / 7);
  }
}
