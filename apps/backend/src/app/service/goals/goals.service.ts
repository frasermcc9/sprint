import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Cron } from "@nestjs/schedule";
import { Numbers } from "@sprint/common";
import { InjectEventEmitter } from "nest-typed-event-emitter";
import { UserCollection } from "../../db/schema/user.schema";
import { EventMap, TypedEventEmitter } from "../../events";
import { RandomService } from "../random/random.service";

interface Goal<T extends keyof EventMap> {
  name: string;
  description: string;
  reward: number;
  quantity: number;
  event: T;
  callback: (args: EventMap[T]) => Promise<void> | void;
}

// hack
let UserCollectionReference: UserCollection | null = null;

const GOALS: Goal<keyof EventMap>[] = [
  {
    name: "Sleep Tracker",
    description: "Fill in todays sleep information.",
    reward: 50,
    quantity: 1,
    event: "action.sleep.added",
    emoji: "😴",
  },
  {
    name: "Sprinter",
    description: "Do a HIIT session.",
    reward: 150,
    quantity: 1,
    event: "action.run.added",
    emoji: "👟",
  },
];

const DAILY_GOAL_COUNT = 1;

@Injectable()
export class GoalsService {
  constructor(
    private readonly randomService: RandomService,
    @InjectEventEmitter() private readonly eventEmitter: TypedEventEmitter,
    @InjectModel("User") userCollection: UserCollection,
  ) {
    UserCollectionReference = userCollection;

    this.applyListeners();
  }

  getDailyGoals() {
    const rand = this.randomService.randomDateSeeded(DAILY_GOAL_COUNT);
    const selectedGoals = rand.map((r) => Numbers.rndToRange(r, GOALS));

    return selectedGoals;
  }

  getDailyGoalCount() {
    return DAILY_GOAL_COUNT;
  }

  @Cron("0 0 * * * *")
  async applyListeners() {
    for (const goal of GOALS) {
      this.eventEmitter.off(goal.event, goal.callback);
    }

    const goals = this.getDailyGoals();
    for (const goal of goals) {
      this.eventEmitter.on(goal.event, goal.callback);
    }
  }
}
