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
    };
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
}
