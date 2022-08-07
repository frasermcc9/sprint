import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Dates, Nullish } from "@sprint/common";
import { UserInputError } from "apollo-server-express";
import { addDays } from "date-fns";
import { HttpService } from "nestjs-http-promise";
import { User, UserCollection } from "../../db/schema/user.schema";
import { SleepResponse } from "./interfaces/sleep.interface";
import { Run } from "../../db/schema/run.schema";
import { InjectEventEmitter } from "nest-typed-event-emitter";
import { TypedEventEmitter } from "../../events";
import { FitbitUser } from "../../middleware/fitbit.types";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: UserCollection,
    private readonly httpService: HttpService,
    @InjectEventEmitter() private readonly eventEmitter: TypedEventEmitter,
  ) {}

  async getUser(fitbitId: string) {
    const user = await this.userModel.findOne({ id: fitbitId });
    if (!user) {
      throw new UnauthorizedException("User not found");
    }
    return user;
  }

  async findFriends(forUser: string, amount: number) {
    const user = await this.getUser(forUser);
    const friendIds = user.friends?.slice(0, amount);

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

    if (friend.pendingFriends?.includes(requesterId)) {
      throw new UserInputError(
        "You have already sent a friend request to that user.",
      );
    }

    if (user?.friends?.includes(friendId)) {
      throw new UserInputError("You are already friends with that user.");
    }
    if (user?.pendingFriends?.includes(friendId)) {
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

    if (!acceptor.pendingFriends?.includes(senderId)) {
      throw new UserInputError("That user has not sent you a friend request.");
    }

    await sender.addFriend({ newFriendId: acceptorId });
    await acceptor.addFriend({ newFriendId: senderId });

    return sender;
  }

  async rejectFriend(userId: string, friendId: string) {
    const acceptor = await this.userModel.findOne({ id: userId });
    acceptor?.rejectFriendRequest({ reject: friendId });

    return friendId;
  }

  async getSleepData(
    fitbitUser: FitbitUser,
    {
      date = addDays(new Date(), 1),
      srcUrl,
    }: {
      date?: Date;
      srcUrl?: Nullish<string>;
    } = {},
  ) {
    const format = Dates.toYYYYMMDD(date);

    const user = await this.getUser(fitbitUser.id);
    const token = fitbitUser.token;

    try {
      const URL =
        srcUrl ||
        `https://api.fitbit.com/1.2/user/-/sleep/list.json?beforeDate=${format}&sort=desc&limit=1&offset=0`;

      const { data } = await this.httpService.get<SleepResponse>(URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const retry = async () => {
        const next = await this.httpService.get<SleepResponse>(
          data.pagination.next,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        return next.data.sleep.find((s) => s.isMainSleep);
      };

      let mainSleep = data.sleep.find((s) => s.isMainSleep);

      let tries = 0;
      while (!mainSleep) {
        mainSleep = await retry();
        if (tries++ > 10) {
          throw new InternalServerErrorException(
            "Could not get a main sleep for the past 10 days.",
          );
        }
      }

      const sleep = {
        date: mainSleep.dateOfSleep,
        awake: mainSleep.levels.summary.wake.minutes,
        deep: mainSleep.levels.summary.deep.minutes,
        light: mainSleep.levels.summary.light.minutes,
        rem: mainSleep.levels.summary.rem.minutes,
        awakenings: mainSleep.levels.summary.wake.count,
        variables: [],
        yesterday: data.pagination.next,
        tomorrow: data.pagination.previous,
      };

      const previousLatest = user.latestSleep();

      const added = await user.addSleep({
        sleep: {
          date: mainSleep.dateOfSleep,
          variables: [],
        },
      });

      if (added) {
        this.eventEmitter.emit("action.sleep.added", {
          user: fitbitUser,
          sleepDate: sleep.date,
          lastUploadedSleep: previousLatest?.date,
        });
      }

      return sleep;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException("Failed to get sleep data");
    }
  }
}
