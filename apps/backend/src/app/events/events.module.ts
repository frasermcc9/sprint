import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "../db/schema/user.schema";
import { XpModule } from "../service/xp/xp.module";
import { AchievementListener } from "./achievements.listener";
import { XpListener } from "./xp.listener";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "User", schema: UserSchema }]),
    XpModule,
  ],
  providers: [AchievementListener, XpListener],
  exports: [],
})
export class EventModule {}
