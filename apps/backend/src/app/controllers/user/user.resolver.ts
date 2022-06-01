import { UseGuards } from "@nestjs/common";
import { Resolver, Query } from "@nestjs/graphql";
import { FitbitGuard } from "../../middleware/fitbit.guard";
import { FitbitUser } from "../../middleware/fitbit.types";
import { User } from "../../middleware/user.decorator";
import { User as GQLUser } from "../../types/graphql";
import { UserService } from "./user.service";

@Resolver("User")
@UseGuards(FitbitGuard)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query()
  currentUser(@User() user: FitbitUser): GQLUser {
    return { id: user.id, firstName: user.firstName, lastName: user.lastName };
  }
}
