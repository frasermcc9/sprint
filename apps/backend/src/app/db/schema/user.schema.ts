import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Model } from "mongoose";

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  id: string;
}

interface Methods {
  setName(this: UserDocument, name: string): Promise<void>;
}

interface Statics {
  createOrUpdate(this: UserCollection, user: User): Promise<UserDocument>;
}

export type UserDocument = User & Document & Methods;
export type UserCollection = Model<UserDocument> & Statics;

export const UserSchema = SchemaFactory.createForClass(User);

const methods: Methods = {
  async setName(this: UserDocument, name: string) {
    this.name = name;
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
};

UserSchema.statics = {
  ...UserSchema.statics,
  ...statics,
};
