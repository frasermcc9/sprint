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

  async findFriends(forUser: string, amount: number) {
    const user = await this.getUser(forUser);
    const friendIds = user.friends.slice(0, amount);

    return this.userModel.find({ id: { $in: friendIds } });
  }

  async getFriendRequests(forUser: string) {
    const user = await this.getUser(forUser);
    const friendIds = user.pendingFriends;

    return this.userModel.find({ id: { $in: friendIds } });
  }
}
