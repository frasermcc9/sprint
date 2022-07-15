import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { EmblemImageUnion, xpDetails } from "@sprint/common";
import { EventMap, ListenTo } from ".";
import { User, UserCollection } from "../db/schema/user.schema";

const levelToEmblem: Record<number, EmblemImageUnion> = {
  0: "Level1",
  1: "Level2",
  2: "Level3",
  3: "Level4",
  4: "Level5",
  5: "Level6",
};

@Injectable()
export class XpListener {
  constructor(
    @InjectModel(User.name) private readonly userModel: UserCollection,
  ) {}

  @ListenTo("internal.xp.added")
  async handleXpEmblem({
    userId,
    newXp,
    xpAdded,
  }: EventMap["internal.xp.added"]) {
    const { level: oldLevel } = xpDetails(newXp - xpAdded);
    const { level: newLevel } = xpDetails(newXp);

    if (oldLevel === newLevel) {
      return;
    }

    if (newLevel > 0 && newLevel % 5 === 0) {
      const emblemVersion = newLevel / 5;
      if (emblemVersion in levelToEmblem) {
        const newEmblem = levelToEmblem[emblemVersion];
        const dbUser = await this.userModel.findOne({ id: userId });
        await dbUser?.unlockEmblem({ emblem: newEmblem });
      }
    }
  }
}
