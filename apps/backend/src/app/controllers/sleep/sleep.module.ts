import { Module } from "@nestjs/common";
import { SleepService } from "./sleep.service";
import { SleepResolver } from "./sleep.resolver";
import { HttpModule } from "nestjs-http-promise";
import { MongooseModule } from "@nestjs/mongoose";
import { User } from "../../db/schema/user.schema";

@Module({
  providers: [SleepResolver, SleepService],
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: User.name, schema: User }]),
  ],
})
export class SleepModule {}
