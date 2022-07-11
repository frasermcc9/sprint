import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Model } from "mongoose";

@Schema()
export class Run {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  duration: number;

  @Prop({ required: true })
  heartRate: Array<number>;

  @Prop({ required: true, default: 0 })
  vo2max: number;

  @Prop({ required: true, default: 10 })
  intensityFeedback: number;
}
interface Methods {
  setName(this: RunDocument): Promise<void>;
}

interface Statics {
  createOrUpdate(this: RunCollection, user: Run): Promise<RunDocument>;
  createIfNotExists(this: RunCollection, user: Run): Promise<RunDocument>;
}

export const RunSchema = SchemaFactory.createForClass(Run);
export type RunDocument = Run & Document & Methods;
export type RunCollection = Model<RunDocument> & Statics;
