import { Children, type ReactNode } from 'react'

type HorizontalSliderProps = {
  index: number
  perView?: number
  className?: string
  trackClassName?: string
  children: ReactNode
}

/**
 * Carrusel horizontal real: desliza con translateX, sin scroll vertical de página.
 */
export default function HorizontalSlider({
  index,
  perView = 1,
  className = '',
  trackClassName = '',
  children,
}: HorizontalSliderProps) {
  const slides = Children.toArray(children).filter(Boolean)
  const count = slides.length
  if (count === 0) return null

  const safeIndex = Math.min(Math.max(0, index), Math.max(0, count - perView))
  const slideShare = 100 / count
  const trackWidth = (count / perView) * 100

  return (
    <div className={`overflow-hidden w-full ${className}`}>
      <div
        className={`flex transition-transform duration-500 ease-in-out ${trackClassName}`}
        style={{
          width: `${trackWidth}%`,
          transform: `translateX(-${safeIndex * slideShare}%)`,
        }}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className="shrink-0"
            style={{ width: `${slideShare}%` }}
            aria-hidden={i < safeIndex || i >= safeIndex + perView}
          >
            {slide}
          </div>
        ))}
      </div>
    </div>
  )
}
