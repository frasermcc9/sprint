import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserCollection } from "../../db/schema/user.schema";
import { UserInputError } from "apollo-server-express";

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

  async sendFriendRequest(requesterId: string, friendId: string) {
    const friend = await this.userModel.findOne({ id: friendId });
    const user = await this.userModel.findOne({ id: requesterId });

    if (!friend) {
      throw new UserInputError("That user does not exist.");
    }

    if (friend.pendingFriends.includes(requesterId)) {
      throw new UserInputError(
        "You have already sent a friend request to that user.",
      );
    }

    if (user?.friends.includes(friendId)) {
      throw new UserInputError("You are already friends with that user.");
    }
    if (user.pendingFriends.includes(friendId)) {
      throw new UserInputError(
        "That user has sent a friend request to you, accept it if you want to add them.",
      );
    }

    await friend.sendFriendRequest({ requesterId });
    return true;
  }

  async acceptFriendRequest(acceptorId: string, senderId: string) {
    const sender = await this.userModel.findOne({ id: senderId });
    const acceptor = await this.userModel.findOne({ id: acceptorId });

    if (!sender || !acceptor) {
      throw new UserInputError("That user does not exist.");
    }

    if (!acceptor.pendingFriends.includes(senderId)) {
      throw new UserInputError("That user has not sent you a friend request.");
    }

    await sender.addFriend({ newFriendId: acceptorId });
    await acceptor.addFriend({ newFriendId: senderId });

    return sender;
  }

  async rejectFriend(userId: string, friendId: string) {
    const acceptor = await this.userModel.findOne({ id: userId });
    acceptor.rejectFriendRequest({ reject: friendId });

    return friendId;
  }
}
