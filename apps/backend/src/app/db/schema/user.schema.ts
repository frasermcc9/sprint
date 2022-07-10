import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Feature } from "@sprint/common";
import { Document, Model } from "mongoose";
import { AccountStage, ExperienceLevel } from "../../types/graphql";
import { Run } from "./run.schema";

type Sleep = {
  date: string;
  variables?: string[];
};

type SleepVariable = {
  name: string;
  emoji: string;
};

@Schema()
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  id: string;

  @Prop({ required: false, type: String })
  experience?: ExperienceLevel;

  @Prop({ required: true, type: String })
  stage: AccountStage;

  @Prop({ required: false, type: Array })
  runs?: Array<Run>;

  @Prop({ required: true, type: String })
  dob: string;

  @Prop({ required: true, type: Number, default: 13 })
  defaultRunDuration?: number;

  @Prop({ required: true, type: Array, default: [] })
  featuresSeen?: Array<Feature>;

  @Prop({ required: true, type: String, default: "" })
  avatarUrl?: string;

  @Prop({ required: true, type: Number, default: Date.now() })
  createdAtUTS?: number;

  @Prop({ required: false, type: Number })
  utcOffset?: number;

  @Prop({ required: true, type: Number, default: 0 })
  xp: number;

  @Prop({ required: true, type: Array, default: [] })
  friends?: Array<string>;

  @Prop({ required: true, type: Array, default: [] })
  pendingFriends?: Array<string>;

  @Prop({
    required: true,
    type: Object,
    default: {
      highIntensity: 30,
      lowIntensity: 30,
      repetitions: 3,
      sets: 3,
      restPeriod: 120,
    },
  })
  currentRunParams?: {
    highIntensity: number;
    lowIntensity: number;
    repetitions: number;
    sets: number;
    restPeriod: number;
  };

  @Prop({ type: Map, of: Object, default: {} })
  sleeps?: Map<string, Sleep>;

  @Prop({ type: [{ type: Object }], default: [] })
  sleepVariables?: Array<SleepVariable>;
}

interface Methods {
  setName(
    this: UserDocument,
    { first, last }: { first: string; last: string },
  ): Promise<void>;
  addXp(this: UserDocument, { xp }: { xp: number }): Promise<void>;
  sendFriendRequest(
    this: UserDocument,
    { requesterId }: { requesterId: string },
  ): Promise<void>;
  addFriend(
    this: UserDocument,
    { newFriendId }: { newFriendId: string },
  ): Promise<void>;
  rejectFriendRequest(
    this: UserDocument,
    { reject }: { reject: string },
  ): Promise<void>;
  addSleep(this: UserDocument, { sleep }: { sleep: Sleep }): Promise<void>;
  getSleep(
    this: UserDocument,
    { date }: { date: string },
  ): Promise<Sleep | null>;
  earliestSleep(this: UserDocument): Sleep | null;
  latestSleep(this: UserDocument): Sleep | null;
}

interface Statics {
  createOrUpdate(this: UserCollection, user: User): Promise<UserDocument>;
  createIfNotExists(this: UserCollection, user: User): Promise<UserDocument>;
  createIfNotExistsAndMerge(
    this: UserCollection,
    user: User,
  ): Promise<UserDocument>;
}

export type UserDocument = User & Document & Methods;
export type UserCollection = Model<UserDocument> & Statics;

export const UserSchema = SchemaFactory.createForClass(User);

const methods: Methods = {
  async setName(
    this: UserDocument,
    { first, last }: { first: string; last: string },
  ) {
    this.firstName = first;
    this.lastName = last;
    await this.save();
  },
  async addXp(this: UserDocument, { xp }: { xp: number }) {
    this.xp += xp;
    await this.save();
  },
  async sendFriendRequest(
    this: UserDocument,
    { requesterId }: { requesterId: string },
  ) {
    this.pendingFriends?.push(requesterId);
    this.markModified("pendingFriends");
    await this.save();
  },
  async addFriend(this: UserDocument, { newFriendId }) {
    this.friends?.push(newFriendId);
    const pending = this.pendingFriends?.indexOf(newFriendId) ?? -1;
    if (pending > -1) {
      this.pendingFriends?.splice(pending, 1);
      this.markModified("pendingFriends");
    }
    this.markModified("friends");
    await this.save();
  },
  async rejectFriendRequest({ reject }) {
    const pending = this.pendingFriends?.indexOf(reject) ?? -1;
    if (pending > -1) {
      this.pendingFriends?.splice(pending, 1);
      this.markModified("pendingFriends");
      await this.save();
    }
  },
  async addSleep(this: UserDocument, { sleep }: { sleep: Sleep }) {
    if (this.sleeps?.has(sleep.date)) return;
    this.sleeps?.set(sleep.date, sleep);
    this.markModified("sleeps");
    await this.save();
  },
  async getSleep(
    this: UserDocument,
    { date }: { date: string },
  ): Promise<Sleep | null> {
    return this.sleeps?.get(date) ?? null;
  },
  earliestSleep(this: UserDocument): Sleep | null {
    const dates = Array.from(this.sleeps?.keys() ?? []);
    if (dates.length === 0) return null;
    const earliestDate = dates.reduce((a, b) => {
      return a < b ? a : b;
    });
    return this.sleeps?.get(earliestDate) ?? null;
  },
  latestSleep(this: UserDocument): Sleep | null {
    const dates = Array.from(this.sleeps?.keys() ?? []);
    if (dates.length === 0) return null;
    const latestDate = dates.reduce((a, b) => {
      return a > b ? a : b;
    });
    return this.sleeps?.get(latestDate) ?? null;
  },
};

UserSchema.methods = {
  ...UserSchema.methods,
  ...methods,
};

const statics: Statics = {
  async createOrUpdate(
    this: UserCollection,
    user: User,
  ): Promise<UserDocument> {
    const dbUser = await this.findOne({ id: user.id });
    if (dbUser) {
      const updatedUser = Object.assign(dbUser, user);
      return await updatedUser.save();
    }
    return await (await this.create(user)).save();
  },
  async createIfNotExists(
    this: UserCollection,
    user: User,
  ): Promise<UserDocument> {
    const dbUser = await this.findOne({ id: user.id });
    if (dbUser) {
      return dbUser;
    }
    return await (await this.create(user)).save();
  },
  async createIfNotExistsAndMerge(
    this: UserCollection,
    user: User,
  ): Promise<UserDocument> {
    const dbUser = await this.findOne({ id: user.id });

    if (dbUser) {
      for (const key in user) {
        if (!dbUser[key]) {
          dbUser[key] = user[key];
        }
      }
      return await dbUser.save();
    }
    return await (await this.create(user)).save();
  },
};

UserSchema.statics = {
  ...UserSchema.statics,
  ...statics,
};
