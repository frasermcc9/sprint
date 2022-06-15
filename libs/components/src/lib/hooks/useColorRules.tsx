import classNames from "classnames";
import { useCallback } from "react";

export interface ColorRuleMatch {
  test: RegExp[] | RegExp;
  className: string;
}

export const useColorRule = (matchers: ColorRuleMatch[]) => {
  return useCallback(
    (text: string) => {
      const words = text.split(" ");

      return (
        <>
          {words.map((word, index) => {
            const match = matchers.find((matcher) =>
              Array.isArray(matcher.test)
                ? matcher.test.some((test) => test.test(word))
                : matcher.test.test(word),
            );

            if (match) {
              return (
                <span key={index} className={classNames(match.className)}>
                  {word + " "}
                </span>
              );
            }

            return <span key={index}>{word + " "}</span>;
          })}
        </>
      );
    },
    [matchers],
  );
};
