type CarouselDotsProps = {
  count: number
  current: number
  onSelect: (index: number) => void
  labelPrefix?: string
  variant?: 'light' | 'dark'
}

export default function CarouselDots({ count, current, onSelect, labelPrefix = 'Ir al slide', variant = 'dark' }: CarouselDotsProps) {
  if (count <= 1) return null

  const inactive = variant === 'light' ? 'bg-white/40 hover:bg-white/60' : 'bg-background-300 hover:bg-background-400'

  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${i === current ? 'bg-accent-500 w-8' : `w-2.5 ${inactive}`}`}
          aria-label={`${labelPrefix} ${i + 1}`}
        />
      ))}
    </div>
  )
}
