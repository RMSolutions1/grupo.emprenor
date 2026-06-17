import { useCallback, useState } from 'react'

/** Carrusel manual (sin temporizador). */
export function useSlider(length: number, initialIndex = 0) {
  const [index, setIndex] = useState(initialIndex)

  const goTo = useCallback(
    (i: number) => {
      if (length <= 0) return
      setIndex(((i % length) + length) % length)
    },
    [length],
  )

  const next = useCallback(() => {
    if (length <= 0) return
    setIndex((i) => (i + 1) % length)
  }, [length])

  const prev = useCallback(() => {
    if (length <= 0) return
    setIndex((i) => (i === 0 ? length - 1 : i - 1))
  }, [length])

  return { index, setIndex: goTo, next, prev }
}
