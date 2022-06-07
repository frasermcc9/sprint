import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Model } from "mongoose";
import { AccountStage, ExperienceLevel } from "../../types/graphql";

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
}

interface Methods {
  setName(
    this: UserDocument,
    { first, last }: { first: string; last: string },
  ): Promise<void>;
}

interface Statics {
  createOrUpdate(this: UserCollection, user: User): Promise<UserDocument>;
  createIfNotExists(this: UserCollection, user: User): Promise<UserDocument>;
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
};

UserSchema.statics = {
  ...UserSchema.statics,
  ...statics,
};
