import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    // Avoid setting state synchronously in effect
    // Initialize immediately if we can, or let the first state handle it
    queueMicrotask(() => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT))
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
