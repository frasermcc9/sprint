import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Model } from "mongoose";

@Schema()
export class Science {
  @Prop({ required: true, type: String })
  user: string;

  @Prop({ required: true })
  event: string;

  @Prop({ required: false, type: String })
  payload: string;
}

interface Methods {}

interface Statics {
  createEvent(
    this: ScienceCollection,
    event: Science,
  ): Promise<ScienceDocument>;
}

export type ScienceDocument = Science & Document & Methods;
export type ScienceCollection = Model<ScienceDocument> & Statics;

export const ScienceSchema = SchemaFactory.createForClass(Science);

const methods: Methods = {};

ScienceSchema.methods = {
  ...ScienceSchema.methods,
  ...methods,
};

const statics: Statics = {
  async createEvent(this: ScienceCollection, event: Science) {
    const dbEvent = await this.create(event);
    return dbEvent.save();
  },
};

ScienceSchema.statics = {
  ...ScienceSchema.statics,
  ...statics,
};
