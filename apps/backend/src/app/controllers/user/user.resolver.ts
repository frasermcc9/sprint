import { UseGuards } from "@nestjs/common";
import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { FitbitGuard } from "../../middleware/fitbit.guard";
import { FitbitUser } from "../../middleware/fitbit.types";
import { User } from "../../middleware/user.decorator";
import {
  AccountStage,
  ExperienceLevel,
  User as GQLUser,
} from "../../types/graphql";
import { UserService } from "./user.service";

@Resolver("User")
@UseGuards(FitbitGuard)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query()
  async currentUser(@User() user: FitbitUser): Promise<GQLUser> {
    const dbUser = await this.userService.getUser(user.id);

    return {
      id: dbUser.id,
      firstName: dbUser.firstName,
      lastName: dbUser.lastName,
      experience: dbUser.experience,
      stage: dbUser.stage,
    };
  }

  @Mutation()
  async completeOnboarding(
    @User() user: FitbitUser,
    @Args("experience") experience: ExperienceLevel,
    @Args("firstName") firstName: string,
    @Args("lastName") lastName: string,
  ) {
    const dbUser = await this.userService.getUser(user.id);
    dbUser.experience = experience;
    dbUser.firstName = firstName;
    dbUser.lastName = lastName;
    dbUser.stage = AccountStage.EXPERIENCE_LEVEL_SELECTED;

    return await dbUser.save();
  }
}
