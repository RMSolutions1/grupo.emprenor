import { useCallback, useEffect, useRef, useState } from 'react'

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

type UseAutoplayOptions = {
  interval?: number
  enabled?: boolean
  inView?: boolean
  initialIndex?: number
}

export function useAutoplay(
  length: number,
  { interval = 9000, enabled = true, inView = true, initialIndex = 0 }: UseAutoplayOptions = {},
) {
  const [index, setIndex] = useState(initialIndex)
  const [paused, setPaused] = useState(false)
  const manualUntil = useRef(0)

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
      manualUntil.current = Date.now() + interval * 2
      setIndex(((i % length) + length) % length)
    },
    [interval, length],
  )

  const manualNext = useCallback(() => {
    manualUntil.current = Date.now() + interval * 2
    next()
  }, [interval, next])

  const manualPrev = useCallback(() => {
    manualUntil.current = Date.now() + interval * 2
    prev()
  }, [interval, prev])

  useEffect(() => {
    if (index >= length && length > 0) setIndex(0)
  }, [index, length])

  useEffect(() => {
    const canPlay = enabled && inView && !paused && length > 1 && !prefersReducedMotion()
    if (!canPlay) return

    const id = window.setInterval(() => {
      if (Date.now() < manualUntil.current) return
      next()
    }, interval)

    return () => window.clearInterval(id)
  }, [enabled, inView, paused, length, interval, next])

  const bindPauseHandlers = {
    onMouseEnter: pause,
    onMouseLeave: resume,
    onFocusCapture: pause,
    onBlurCapture: resume,
  }

  return {
    index,
    setIndex: goTo,
    next: manualNext,
    prev: manualPrev,
    paused,
    pause,
    resume,
    bindPauseHandlers,
  }
}
