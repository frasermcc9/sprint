import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "../../db/schema/user.schema";
import { RandomModule } from "../random/random.module";
import { XpModule } from "../xp/xp.module";
import { GoalsCallbackService, GoalsService } from "./goals.service";

@Module({
  controllers: [],
  providers: [GoalsService, GoalsCallbackService],
  imports: [
    RandomModule,
    MongooseModule.forFeature([{ name: "User", schema: UserSchema }]),
    XpModule,
  ],
  exports: [GoalsService],
})
export class GoalsModule {}
