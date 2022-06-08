import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./controllers/auth/auth.module";
import { join } from "path";
import { FitbitGuard } from "./middleware/fitbit.guard";
import { FitbitStrategy } from "./middleware/fitbit.strategy";
import { HttpModule } from "nestjs-http-promise";
import { DbModule } from "./db/db.module";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./db/schema/user.schema";
import { UserModule } from "./controllers/user/user.module";
import { RunModule } from "./controllers/run/run.module";

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://localhost/sprint"),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      typePaths: ["./**/*.graphql"],
      driver: ApolloDriver,
      definitions: {
        path: join(process.cwd(), "apps/backend/src/app/types/graphql.ts"),
      },
    }),
    AuthModule,
    HttpModule,
    DbModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UserModule,
    RunModule,
  ],
  controllers: [AppController],
  providers: [AppService, FitbitGuard, FitbitStrategy],
})
export class AppModule {}
