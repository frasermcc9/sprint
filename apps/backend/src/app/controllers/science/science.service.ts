import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {
  Science,
  ScienceCollection,
  ScienceDocument,
} from "../../db/schema/science.schema";

@Injectable()
export class ScienceService {
  constructor(
    @InjectModel(Science.name) private readonly scienceModel: ScienceCollection,
  ) {}

  createEvent(
    userId: string,
    event: string,
    payload: string,
  ): Promise<ScienceDocument> | null {
    try {
      // ensure it is valid JSON
      JSON.parse(payload);
      return this.scienceModel.createEvent({ user: userId, event, payload });
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
