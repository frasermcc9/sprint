import { Feature } from "@sprint/common";
import { useFeaturesSeenQuery, useMarkFeatureSeenMutation } from "@sprint/gql";
import { useCallback, useMemo } from "react";

export const useFeaturesSeen = (feature: Feature) => {
  const { data, loading, error } = useFeaturesSeenQuery();

  const [executeMarkFeatureSeen] = useMarkFeatureSeenMutation({
    variables: {
      feature: feature,
    },
    optimisticResponse: {
      __typename: "Mutation",
      markFeatureSeen: [...(data?.currentUser?.features ?? []), feature],
    },
    update: (cache, { data: updated }) => {
      if (!data?.currentUser) {
        return;
      }

      cache.modify({
        id: cache.identify(data?.currentUser),
        fields: {
          features: () => updated?.markFeatureSeen ?? [],
        },
      });
    },
  });

  const featureSeen = useMemo(
    () => data?.currentUser?.features.includes(feature) ?? false,
    [data?.currentUser?.features, feature],
  );

  const markFeatureSeen = useCallback(() => {
    executeMarkFeatureSeen();
  }, [executeMarkFeatureSeen]);

  return [featureSeen, markFeatureSeen, { loading, error }] as const;
};
