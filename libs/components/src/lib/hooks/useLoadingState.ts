import { useEffect, useState } from "react";

export const useLoadingState = <T>(loadingValue: T) => {
  const [state, setState] = useState(loadingValue);

  const [first, setFirst] = useState(true);

  useEffect(() => {
    if (loadingValue && first) {
      setState(loadingValue);
      setFirst(false);
    }
  }, [first, loadingValue]);

  return [state, setState] as const;
};
