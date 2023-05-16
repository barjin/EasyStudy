import { useEffect, useRef } from 'react';

/**
 * A React hook for setting up an interval.
 * @param callback The callback to run on each interval.
 * @param delay  The delay between intervals in milliseconds.
 */
export function useInterval(callback: () => any, delay: number) {
  const savedCallback = useRef<typeof callback | null>(null);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current?.();
    }
    tick();
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}