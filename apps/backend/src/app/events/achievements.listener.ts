import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Dates, XPRewards } from "@sprint/common";
import { EventMap, ListenTo } from ".";
import { User, UserCollection } from "../db/schema/user.schema";
import { XpService } from "../service/xp/xp.service";

@Injectable()
export class AchievementListener {
  constructor(
    @InjectModel(User.name) private readonly userModel: UserCollection,
    private readonly xpService: XpService,
  ) {}

  @ListenTo("action.sleep.added")
  async handleSleepAdded({
    user,
    sleepDate,
    lastUploadedSleep,
  }: EventMap["action.sleep.added"]) {
    const dbUser = await this.userModel.findOne({ id: user.id });

    if (!dbUser) {
      return;
    }

    if (!lastUploadedSleep) {
      return this.xpService.addXp(dbUser, XPRewards.ADD_SLEEP_DATA);
    }

    if (Dates.datesAreConsecutive(lastUploadedSleep, sleepDate)) {
      await dbUser?.incrementSleepTrackStreak();

      return this.xpService.addXp(
        dbUser,
        XPRewards.ADD_SLEEP_DATA +
          XPRewards.ADD_SLEEP_DATA * Math.min(dbUser.sleepTrackStreak, 5),
      );
    }

    if (!Dates.dateIsBefore(lastUploadedSleep, sleepDate)) {
      await dbUser?.resetSleepTrackStreak();
      return this.xpService.addXp(dbUser, XPRewards.ADD_SLEEP_DATA);
    }

    // Do not award XP if back-filled data
  }

  @ListenTo("action.run.added")

  async handleRunAdded({
    userId,
    runDate,
    latestRunDate,
  }: EventMap["action.run.added"]) {

    const dbUser = await this.userModel.findOne({ id: userId });
    if (!dbUser) {
      return;
    }

    if (!latestRunDate) {
      return this.xpService.addXp(dbUser, XPRewards.ADD_RUN_DATA);
    }

    if (Dates.dateWithin2Days(latestRunDate, runDate)) {
      await dbUser?.incrementRunTrackStreak();
      return this.xpService.addXp(dbUser, XPRewards.ADD_RUN_DATA);
    } else {
      await dbUser?.resetRunTrackStreak();
      return this.xpService.addXp(dbUser, XPRewards.ADD_RUN_DATA);
    }

  }
}
