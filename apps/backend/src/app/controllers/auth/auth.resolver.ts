import { UseGuards } from "@nestjs/common";
import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { FitbitGuard } from "../../middleware/fitbit.guard";
import { FitbitUser } from "../../middleware/fitbit.types";
import { User } from "../../middleware/user.decorator";
import { AuthService } from "./auth.service";

@Resolver("Auth")
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  @Mutation()
  login(@Args("code") code: string) {
    return this.authService.exchangeCode({
      code,
      clientId: process.env.FITBIT_OAUTH_CLIENT_ID,
      clientSecret: process.env.FITBIT_OAUTH_CLIENT_SECRET,
    });
  }

  @Mutation()
  refresh(@Args("token") token: string) {
    return this.authService.refresh({
      token,
      clientId: process.env.FITBIT_OAUTH_CLIENT_ID,
      clientSecret: process.env.FITBIT_OAUTH_CLIENT_SECRET,
    });
  }

  @Query()
  getAuthLink() {
    return this.authService.buildAuthLink({
      clientId: process.env.FITBIT_OAUTH_CLIENT_ID,
      redirectUrl: process.env.FRONTEND_HOST + "/get_token",
    });
  }

  @Query()
  @UseGuards(FitbitGuard)
  testAuth(@User() user: FitbitUser) {
    console.log(user.id);
  }
}
