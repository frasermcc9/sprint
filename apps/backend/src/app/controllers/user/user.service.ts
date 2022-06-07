import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserCollection } from "../../db/schema/user.schema";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: UserCollection,
  ) {}

  getUser(fitbitId: string) {
    return this.userModel.findOne({ id: fitbitId });
  }
}
