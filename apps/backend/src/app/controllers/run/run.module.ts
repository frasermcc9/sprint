import { Module } from "@nestjs/common";
import { RunService } from "./run.service";
import { RunResolver } from "./run.resolver";
import { MongooseModule } from "@nestjs/mongoose";
import { Run, RunSchema } from "../../db/schema/run.schema";
import { UserResolver } from "../user/user.resolver";
import { UserService } from "../user/user.service";
import { User, UserSchema } from "../../db/schema/user.schema";

@Module({
  providers: [RunResolver, RunService],
  imports: [
    MongooseModule.forFeature([
      { name: Run.name, schema: RunSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
})
export class RunModule {}
