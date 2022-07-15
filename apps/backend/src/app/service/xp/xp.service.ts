import { Injectable } from "@nestjs/common";
import { InjectEventEmitter } from "nest-typed-event-emitter";
import { UserDocument } from "../../db/schema/user.schema";
import { TypedEventEmitter } from "../../events";

@Injectable()
export class XpService {
  constructor(
    @InjectEventEmitter() private readonly eventEmitter: TypedEventEmitter,
  ) {}

  async addXp(user: UserDocument, xp: number) {
    await user.addXp({ xp });

    this.eventEmitter.emit("internal.xp.added", {
      newXp: user.xp,
      xpAdded: xp,
      userId: user.id,
    });
  }
}
