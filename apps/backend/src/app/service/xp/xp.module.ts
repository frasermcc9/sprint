import { Module } from "@nestjs/common";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "../../db/schema/user.schema";
import { XpService } from "./xp.service";

@Module({
  controllers: [],
  providers: [XpService],
  exports: [XpService],
  imports: [
    EventEmitterModule,
    MongooseModule.forFeature([{ name: "User", schema: UserSchema }]),
  ],
})
export class XpModule {}
