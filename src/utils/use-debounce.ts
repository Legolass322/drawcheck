import { useEffect, useRef } from "react";

export function useDebounce(debounced: () => void, time: number, deps: unknown[]) {
  const timeoutRef = useRef<number | null>(null)
  
  useEffect(() => {
    const timeout = window.setTimeout(() => debounced(), time >= 0 ? time : 0)
    timeoutRef.current = timeout

    return () => {
      clearTimeout(timeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
