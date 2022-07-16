import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { HttpModule } from "nestjs-http-promise";
import { User, UserSchema } from "../../db/schema/user.schema";
import { UserResolver } from "./user.resolver";
import { UserService } from "./user.service";

@Module({
  providers: [UserResolver, UserService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    HttpModule,
  ],
})
export class UserModule {}
