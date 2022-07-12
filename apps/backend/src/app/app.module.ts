import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { GraphQLModule } from "@nestjs/graphql";
import { MongooseModule } from "@nestjs/mongoose";
import { HttpModule } from "nestjs-http-promise";
import { join } from "path";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./controllers/auth/auth.module";
import { RunModule } from "./controllers/run/run.module";
import { ScienceModule } from "./controllers/science/science.module";
import { SleepModule } from "./controllers/sleep/sleep.module";
import { UserModule } from "./controllers/user/user.module";
import { DbModule } from "./db/db.module";
import { User, UserSchema } from "./db/schema/user.schema";
import { EventModule } from "./events/events.module";
import { FitbitGuard } from "./middleware/fitbit.guard";
import { FitbitStrategy } from "./middleware/fitbit.strategy";

@Module({
  imports: [
    MongooseModule.forRoot(
      (() => {
        if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL not set");
        return process.env.DATABASE_URL;
      })(),
    ),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      typePaths: ["./**/*.graphql"],
      driver: ApolloDriver,
      definitions: {
        path: join(process.cwd(), "apps/backend/src/app/types/graphql.ts"),
      },
    }),
    EventEmitterModule.forRoot(),
    EventModule,
    AuthModule,
    HttpModule,
    DbModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UserModule,
    RunModule,
    ScienceModule,
    SleepModule,
  ],
  controllers: [AppController],
  providers: [AppService, FitbitGuard, FitbitStrategy],
})
export class AppModule {}
