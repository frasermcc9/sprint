import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "../db/schema/user.schema";
import { AchievementListener } from "./achievements.listener";

@Module({
  imports: [MongooseModule.forFeature([{ name: "User", schema: UserSchema }])],
  providers: [AchievementListener],
  exports: [],
})
export class EventModule {}
