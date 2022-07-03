import { InjectModel } from "@nestjs/mongoose";
import { User, UserCollection } from "../../db/schema/user.schema";
import { UserInputError } from "apollo-server-express";
import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from "@nestjs/common";
import { toYYYYMMDD } from "@sprint/common";
import * as tf from "@tensorflow/tfjs-node";
import { HttpService } from "nestjs-http-promise";
import { SleepResponse } from "./interfaces/sleep.interface";

@Injectable()
export class UserService implements OnModuleInit {
  private model?: tf.LayersModel;

  constructor(
    @InjectModel(User.name) private readonly userModel: UserCollection,
    private readonly httpService: HttpService,
  ) {}

  async onModuleInit() {
    this.model = await tf.loadLayersModel(
      `file://${__dirname}/assets/sleep-model/model.json`,
    );
  }

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

  getSleepScore({
    awake,
    awakenings,
    deep,
    light,
    rem,
  }: {
    awake: number;
    rem: number;
    deep: number;
    light: number;
    awakenings: number;
  }) {
    const prediction = this.model.predict(
      tf.tensor([awake, awakenings, rem, light, deep], [1, 5]),
    );

    if (Array.isArray(prediction)) {
      return Math.round(Array.from(prediction[0].dataSync())[0]);
    }
    return Math.round(Array.from(prediction.dataSync())[0]);
  }

  async getSleepData(token: string, date: Date = new Date()) {
    const format = toYYYYMMDD(date);
    try {
      const { data } = await this.httpService.get<SleepResponse>(
        `https://api.fitbit.com/1.2/user/-/sleep/date/${format}.json`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return data;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException("Failed to get sleep data");
    }
  }
}
