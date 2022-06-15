import { useAnalyticsObservationMutation } from "@sprint/gql";
import { useCallback, useEffect, useState } from "react";

/**
 * Use analytics
 *
 * @param defaultEvent - The default event to be used if no event is provided
 * @param defaultPayload The default payload. Note this will be merged with the
 * payload provided on the event call (prioritizing the payload provided on the
 * event call)
 * @returns
 */
export const useScience = (
  defaultEvent?: string,
  defaultPayload?: Record<string, unknown>,
) => {
  const [executeObservation] = useAnalyticsObservationMutation();

  const createEvent = useCallback(
    (event = defaultEvent, payload?: Record<string, unknown>) => {
      if (!event) {
        throw new Error("Event is required");
      }

      return executeObservation({
        variables: {
          event,
          payload: JSON.stringify({ ...defaultPayload, ...payload }),
        },
      });
    },
    [defaultEvent, defaultPayload, executeObservation],
  );

  return createEvent;
};

type OnLoadScienceOptions = {
  /** Additional properties to send with the event */
  payload?: Record<string, unknown>;
  /** Will not post the event until skip is false */
  skip?: boolean;
};

/**
 * Use the analytics but will only be called once.
 */
export const useScienceOnLoad = (
  event: string,
  { payload = {}, skip = false }: OnLoadScienceOptions = {
    payload: {},
    skip: false,
  },
) => {
  const track = useScience(event, payload);
  const [called, setCalled] = useState(false);

  useEffect(() => {
    if (!skip && !called) {
      track();
      setCalled(true);
    }
  }, [called, skip, track]);
};
