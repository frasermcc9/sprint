import { RefreshIcon } from "@heroicons/react/outline";
import {
  forwardRef,
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
} from "react";

export interface PullToRefreshProps {
  onRefresh: () => Promise<unknown> | unknown;
}

export const PullToRefresh = forwardRef<
  HTMLElement,
  PropsWithChildren<PullToRefreshProps>
>(({ children, onRefresh }, ref) => {
  const startY = useRef(0);
  const currentY = useRef(0);

  const indicator = useRef<HTMLDivElement>(null);
  const icon = useRef<SVGSVGElement>(null);

  const onTouchStart = useCallback((e: MouseEvent | TouchEvent) => {
    if (e instanceof TouchEvent) {
      startY.current = e.touches[0].clientY;
    }
  }, []);
  const onTouchMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (e instanceof TouchEvent) {
      currentY.current = e.touches[0].clientY;

      if (indicator.current && icon.current) {
        indicator.current.style.transform = `translateY(${Math.min(
          (currentY.current - startY.current - 100) / 2,
          50,
        )}px) rotate(${Math.min(currentY.current - startY.current, 200)}deg)`;
        icon.current.style.opacity = `${
          Math.min(currentY.current - startY.current - 50, 100) / 90
        }`;
      }
    }
  }, []);
  const onEnd = useCallback(async () => {
    if (currentY.current - startY.current > 200) {
      await onRefresh();
    }
    currentY.current = 0;

    if (indicator.current) {
      indicator.current.style.transform = `translateY(-50px)`;
    }
  }, [onRefresh]);

  useEffect(() => {
    if (typeof ref === "function") return;

    const childEl = ref?.current;

    if (!childEl) {
      return;
    }

    childEl.addEventListener("touchstart", onTouchStart, { passive: true });
    childEl.addEventListener("touchmove", onTouchMove, { passive: false });
    childEl.addEventListener("touchend", onEnd);

    return () => {
      childEl.removeEventListener("touchstart", onTouchStart);
      childEl.removeEventListener("touchmove", onTouchMove);
      childEl.removeEventListener("touchend", onEnd);
    };
  }, [ref, onEnd, onTouchMove, onTouchStart]);

  return (
    <>
      {children}
      <div className="fixed flex w-full justify-center" ref={indicator}>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg">
          <RefreshIcon ref={icon} className="p-1.5 text-indigo-600" />
        </div>
      </div>
    </>
  );
});

export default PullToRefresh;
