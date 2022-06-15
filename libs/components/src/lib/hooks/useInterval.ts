import { useEffect } from "react";

export interface UseIntervalOptions {
  rate?: number;
  update: () => void;
  isComplete?: () => boolean;
  condition?: boolean;
}

export const useInterval = ({
  rate = 100,
  update,
  isComplete = () => false,
  condition = true,
}: UseIntervalOptions) => {
  useEffect(() => {
    if (!condition) {
      return;
    }

    const timeout = setInterval(() => {
      update();
    }, rate);

    if (isComplete()) {
      clearInterval(timeout);
    }

    return () => clearInterval(timeout);
  }, [isComplete, rate, update, condition]);
};
