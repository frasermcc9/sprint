import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { join } from "path";
import { FitbitGuard } from "./middleware/fitbit.guard";
import { FitbitStrategy } from "./middleware/fitbit.strategy";
import { HttpModule } from "nestjs-http-promise";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      typePaths: ["./**/*.graphql"],
      driver: ApolloDriver,
      definitions: {
        path: join(process.cwd(), "apps/backend/src/app/types/graphql.ts"),
      },
    }),
    AuthModule,
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService, FitbitGuard, FitbitStrategy],
})
export class AppModule {}
