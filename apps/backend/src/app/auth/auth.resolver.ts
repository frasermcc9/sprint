import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
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

  @Query()
  getAuthLink() {
    return this.authService.buildAuthLink({
      clientId: process.env.FITBIT_OAUTH_CLIENT_ID,
      redirectUrl: process.env.FRONTEND_HOST + "/get_token",
    });
  }
}
