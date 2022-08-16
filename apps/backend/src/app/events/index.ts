import { FitbitUser } from "../middleware/fitbit.types";
import { IEventEmitter, createTypedListener } from "nest-typed-event-emitter";

export type TypedEventEmitter = IEventEmitter<EventMap, true>;
export const ListenTo = createTypedListener<EventMap>();

export interface EventMap {
  "action.sleep.added": BaseEvent & {
    sleepDate: string;
    lastUploadedSleep?: string;
  };
  "internal.xp.added": {
    newXp: number;
    xpAdded: number;
    userId: string;
  };
  "action.run.added": {
    userId: string;
    runDate: string;
    latestRunDate?: string;
  };
}

export interface BaseEvent {
  user: FitbitUser;
}
