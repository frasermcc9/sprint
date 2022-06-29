import classNames from "classnames";
import { useCallback } from "react";

export interface ColorRuleMatch {
  className: string;
  test: RegExp[] | RegExp;
}

export const useColorRule = (matchers: ColorRuleMatch[]) => {
  return useCallback(
    (text: string | number) => {
      const words = text.toString().split(" ");

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

export interface ColorRuleRange {
  className: string;
  /** Inclusive of both */
  range: [number, number];
}

export const useColorRangeRule = (ranges: ColorRuleRange[]) => {
  return useCallback(
    (text: string | number) => {
      const number = +text;

      const match = ranges.find(
        (range) => range.range[0] <= number && number <= range.range[1],
      );

      if (match) {
        return <span className={match.className}>{text}</span>;
      }

      return <span>{text}</span>;
    },
    [ranges],
  );
};
