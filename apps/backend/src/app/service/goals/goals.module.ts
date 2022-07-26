import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "../../db/schema/user.schema";
import { RandomModule } from "../random/random.module";
import { GoalsService } from "./goals.service";

@Module({
  controllers: [],
  providers: [GoalsService],
  imports: [
    RandomModule,
    MongooseModule.forFeature([{ name: "User", schema: UserSchema }]),
  ],
  exports: [GoalsService],
})
export class GoalsModule {}
