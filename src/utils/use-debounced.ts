import { useEffect, useRef } from "react"

import debounce, { DebouncedFunc } from 'lodash-es/debounce'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Fany = (...args: any) => any

export function useDebounced<T extends Fany>(fn: T, wait: number, deps: unknown[]) {
  const fnRef = useRef<DebouncedFunc<T>>(debounce(fn, wait))
  
  useEffect(() => {
    fnRef.current = debounce(fn, wait)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return fnRef
}