import { useEffect } from "react";

export const useLog = (component: string, message: string) => {
  useEffect(() => {
    console.log(
      `%c[${component}] %c${message}`,
      "color: rgb(99 102 241);",
      "color: rgb(255, 255, 255);",
    );
  }, [component, message]);
};

/**
 * For outside of react hierarchy
 *
 * @param component
 * @param message
 */
export const useExternalLog = (component: string, message: string) => {
  console.log(
    `%c[${component}] %c${message}`,
    "color: rgb(99 102 241);",
    "color: rgb(255, 255, 255);",
  );
};
