import { type ReactNode } from 'react'
import { useAutoplay } from '../hooks/useAutoplay'
import HorizontalSlider from './HorizontalSlider'
import { useEffect, useState } from 'react'

type Breakpoints = { default: number; sm?: number; md?: number; lg?: number }

function slidesPerViewAt(width: number, perView: Breakpoints) {
  if (perView.lg && width >= 1024) return perView.lg
  if (perView.md && width >= 768) return perView.md
  if (perView.sm && width >= 640) return perView.sm
  return perView.default
}

type AutoCardSliderProps<T> = {
  items: T[]
  itemKey: (item: T) => string
  renderItem: (item: T) => ReactNode
  interval?: number
  perView?: Breakpoints
  ariaLabel?: string
  className?: string
  showArrows?: boolean
}

export default function AutoCardSlider<T>({
  items,
  itemKey,
  renderItem,
  interval = 5000,
  perView = { default: 1, md: 2, lg: 4 },
  ariaLabel = 'Carrusel',
  className = '',
  showArrows = true,
}: AutoCardSliderProps<T>) {
  const [spv, setSpv] = useState(() => slidesPerViewAt(typeof window !== 'undefined' ? window.innerWidth : 1280, perView))
  const maxIndex = Math.max(0, items.length - spv)
  const { index, setIndex, next, prev, bindPauseHandlers } = useAutoplay(maxIndex + 1, {
    interval,
    enabled: items.length > spv,
  })

  useEffect(() => {
    const onResize = () => setSpv(slidesPerViewAt(window.innerWidth, perView))
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [perView])

  useEffect(() => {
    if (index > maxIndex) setIndex(maxIndex)
  }, [index, maxIndex, setIndex])

  if (!items.length) return null

  return (
    <div className={className} {...bindPauseHandlers}>
      <div className="relative">
        {showArrows && items.length > spv && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full border border-background-300 bg-background-50/95 hover:bg-accent-500 hover:border-accent-500 hover:text-white text-foreground-600 shadow-sm transition-all duration-300 -ml-2 md:ml-0"
              aria-label="Anterior"
            >
              <i className="ri-arrow-left-line text-lg" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full border border-background-300 bg-background-50/95 hover:bg-accent-500 hover:border-accent-500 hover:text-white text-foreground-600 shadow-sm transition-all duration-300 -mr-2 md:mr-0"
              aria-label="Siguiente"
            >
              <i className="ri-arrow-right-line text-lg" />
            </button>
          </>
        )}

        <div role="region" aria-label={ariaLabel} aria-live="polite" className="px-1">
          <HorizontalSlider index={index} perView={spv}>
            {items.map((item) => (
              <div key={itemKey(item)} className="px-2 md:px-3 h-full">
                {renderItem(item)}
              </div>
            ))}
          </HorizontalSlider>
        </div>
      </div>

      {items.length > spv && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: maxIndex + 1 }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${i === index ? 'bg-accent-500 w-8' : 'w-2.5 bg-background-300 hover:bg-background-400'}`}
              aria-label={`Ir al slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
