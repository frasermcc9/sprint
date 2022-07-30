import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Cron } from "@nestjs/schedule";
import { LesserOrEqual, Numbers, STATIC_ASSERT_TRUE } from "@sprint/common";
import { InjectEventEmitter } from "nest-typed-event-emitter";
import { UserCollection } from "../../db/schema/user.schema";
import { EventMap, TypedEventEmitter } from "../../events";
import { RandomService } from "../random/random.service";
import { XpService } from "../xp/xp.service";

interface Goal<T extends keyof EventMap> {
  name: keyof GoalsCallbackService;
  description: string;
  reward: number;
  quantity: number;
  event: T;
  emoji: string;
}

const GOALS = [
  {
    name: "SleepTracker",
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
] as const;

const DAILY_GOAL_COUNT = 2;

type _ = STATIC_ASSERT_TRUE<
  "DAILY_GOAL_COUNT cannot exceed GOALS.length",
  LesserOrEqual<typeof DAILY_GOAL_COUNT, typeof GOALS.length>
>;

const GOAL_MEMO = GOALS.reduce((acc, goal) => {
  acc[goal.name] = goal;
  return acc;
}, {} as Record<keyof GoalsCallbackService, Goal<keyof EventMap>>);

@Injectable()
export class GoalsCallbackService {
  constructor(
    @InjectModel("User") private readonly userCollection: UserCollection,
    private readonly xpService: XpService,
  ) {}

  private goalInfo(name: keyof GoalsCallbackService) {
    return {
      name,
      goal: GOAL_MEMO[name],
    } as const;
  }

  private async updateGoal({
    goal,
    name,
    increment,
    userId,
  }: {
    goal: Goal<keyof EventMap>;
    name: keyof GoalsCallbackService;
    increment: number;
    userId: string;
  }) {
    const dbUser = await this.userCollection.findOne({ id: userId });
    if (!dbUser) {
      return console.error(`User ${userId} not found`);
    }

    const didComplete = await dbUser?.updateGoal({
      name,
      increment,
      max: goal.quantity,
    });

    if (didComplete) {
      await this.xpService.addXp(dbUser, goal.reward);
    }
  }

  async SleepTracker({ user }: EventMap["action.sleep.added"]) {
    const { goal, name } = this.goalInfo("SleepTracker");

    await this.updateGoal({
      goal,
      name,
      increment: 1,
      userId: user.id,
    });
  }

  async Sprinter({ userId }: EventMap["action.run.added"]) {
    const { goal, name } = this.goalInfo("Sprinter");

    await this.updateGoal({
      goal,
      name,
      increment: 1,
      userId,
    });
  }
}

@Injectable()
export class GoalsService {
  private callbackList: [string, () => void][] = [];

  constructor(
    private readonly randomService: RandomService,
    @InjectEventEmitter() private readonly eventEmitter: TypedEventEmitter,
    private readonly callbackService: GoalsCallbackService,
  ) {
    this.applyListeners();
  }

  getDailyGoals() {
    const rand = this.randomService.randomDateSeeded(DAILY_GOAL_COUNT);
    const selectedGoals = Numbers.uniqueRandomRange(rand, GOALS);

    return selectedGoals;
  }

  getDailyGoalCount() {
    return DAILY_GOAL_COUNT;
  }

  @Cron("0 0 * * * *")
  async applyListeners() {
    for (const callback of this.callbackList) {
      this.eventEmitter.off(callback[0], callback[1]);
    }
    this.callbackList.length = 0;

    const goals = this.getDailyGoals();
    for (const goal of goals) {
      const callback = this.callbackService[goal.name].bind(
        this.callbackService,
      ) as () => void;

      this.eventEmitter.on(goal.event, callback);
      this.callbackList.push([goal.event, callback]);
    }
  }
}
