import { Link } from 'react-router-dom'
import { AccentButton } from './Layout'
import { IMAGES } from '../data/images'
import type { HeroSlideCopy, HeroStripStatCopy } from '../data/pages'
import { resolveImage } from '../lib/pageCopy'
import { useAutoplay } from '../hooks/useAutoplay'
import CarouselDots from './CarouselDots'

type HomeHeroProps = {
  slides: HeroSlideCopy[]
  strip: HeroStripStatCopy[]
  ctaPrimary: string
  ctaSecondary: string
  ctaSecondaryUrl: string
}

export default function HomeHero({ slides, strip, ctaPrimary, ctaSecondary, ctaSecondaryUrl }: HomeHeroProps) {
  const { index: current, setIndex: setCurrent, bindPauseHandlers } = useAutoplay(slides.length, { interval: 8000 })
  const slide = slides[current] ?? slides[0]

  if (!slide) return null

  return (
    <>
      <section className="relative h-screen min-h-[700px] w-full overflow-hidden" {...bindPauseHandlers}>
        {slides.map((s, i) => {
          const img = resolveImage(s.image, IMAGES.hero)
          return (
            <div
              key={i}
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}
              style={{ backgroundImage: `url("${img}")` }}
              aria-hidden={i !== current}
            />
          )
        })}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-950/70 via-primary-950/50 to-primary-950/70" />
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent-500/20 to-transparent blur-3xl" />
          <div className="absolute bottom-0 left-0 w-2/3 h-1/2 bg-gradient-to-t from-primary-900/40 to-transparent blur-2xl" />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full w-full px-6 md:px-12 text-center">
          {slide.label && (
            <p className="mb-4 md:mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-xs md:text-sm font-body font-medium uppercase tracking-wider">
              {slide.label}
            </p>
          )}
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-5xl text-balance transition-opacity duration-500">
            {slide.title}
          </h1>
          {slide.subtitle && (
            <p className="mt-6 md:mt-8 text-base md:text-lg text-white/70 font-body font-light max-w-3xl leading-relaxed">
              {slide.subtitle}
            </p>
          )}
          <div className="mt-10 md:mt-12 flex flex-col sm:flex-row items-center gap-4">
            <AccentButton to="/contacto">{ctaPrimary}</AccentButton>
            <Link to={ctaSecondaryUrl} className="whitespace-nowrap px-10 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white text-sm md:text-base font-body font-medium rounded-md transition-all duration-300">
              {ctaSecondary}
            </Link>
          </div>
        </div>

        {slides.length > 1 && (
          <div className="absolute bottom-28 md:bottom-32 left-0 right-0 z-10">
            <CarouselDots count={slides.length} current={current} onSelect={setCurrent} labelPrefix="Ir al slide" variant="light" />
          </div>
        )}
      </section>

      {strip.length > 0 && (
        <section className="relative z-20 -mt-16 md:-mt-20 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 bg-white rounded-xl shadow-xl border border-background-200 p-6 md:p-8">
              {strip.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl md:text-4xl font-heading font-bold text-accent-500">{stat.value}</p>
                  <p className="mt-1 text-xs md:text-sm font-body text-foreground-600 leading-snug">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
