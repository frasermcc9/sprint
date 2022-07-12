import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Dates, XPRewards } from "@sprint/common";
import { EventMap, ListenTo } from ".";
import { User, UserCollection } from "../db/schema/user.schema";

@Injectable()
export class AchievementListener {
  constructor(
    @InjectModel(User.name) private readonly userModel: UserCollection,
  ) {}

  @ListenTo("action.sleep.added")
  async handleSleepAdded({
    user,
    sleepDate,
    lastUploadedSleep,
  }: EventMap["action.sleep.added"]) {
    const dbUser = await this.userModel.findOne({ id: user.id });

    if (!lastUploadedSleep) {
      await dbUser?.addXp({ xp: XPRewards.ADD_SLEEP_DATA });
      return;
    }

    console.log({ lastUploadedSleep, sleepDate });

    if (Dates.datesAreConsecutive(lastUploadedSleep, sleepDate)) {
      await dbUser?.incrementSleepTrackStreak();
      await dbUser?.addXp({
        xp:
          XPRewards.ADD_SLEEP_DATA +
          XPRewards.ADD_SLEEP_DATA * Math.min(dbUser.sleepTrackStreak, 5),
      });
      return;
    }

    if (!Dates.dateIsBefore(lastUploadedSleep, sleepDate)) {
      await dbUser?.resetSleepTrackStreak();
    }
    // back-filled data shouldn't award streak bonus
    await dbUser?.addXp({ xp: XPRewards.ADD_SLEEP_DATA });
  }
}
