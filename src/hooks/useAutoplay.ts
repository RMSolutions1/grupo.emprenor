import { useCallback, useEffect, useState } from 'react'

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

type UseAutoplayOptions = {
  interval?: number
  enabled?: boolean
  initialIndex?: number
}

export function useAutoplay(
  length: number,
  { interval = 6000, enabled = true, initialIndex = 0 }: UseAutoplayOptions = {},
) {
  const [index, setIndex] = useState(initialIndex)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => {
    if (length <= 0) return
    setIndex((i) => (i + 1) % length)
  }, [length])

  const prev = useCallback(() => {
    if (length <= 0) return
    setIndex((i) => (i === 0 ? length - 1 : i - 1))
  }, [length])

  const pause = useCallback(() => setPaused(true), [])
  const resume = useCallback(() => setPaused(false), [])

  const goTo = useCallback(
    (i: number) => {
      if (length <= 0) return
      setIndex(((i % length) + length) % length)
    },
    [length],
  )

  useEffect(() => {
    if (index >= length && length > 0) setIndex(0)
  }, [index, length])

  useEffect(() => {
    const canPlay = enabled && !paused && length > 1 && !prefersReducedMotion()
    if (!canPlay) return
    const id = window.setInterval(next, interval)
    return () => window.clearInterval(id)
  }, [enabled, paused, length, interval, next])

  const bindPauseHandlers = {
    onMouseEnter: pause,
    onMouseLeave: resume,
    onFocusCapture: pause,
    onBlurCapture: resume,
  }

  return { index, setIndex: goTo, next, prev, paused, pause, resume, bindPauseHandlers }
}
