import { getAfipF960Url, AFIP_F960_IMAGE } from '../data/afip'

export default function AfipF960Badge({ className = '' }: { className?: string }) {
  return (
    <a
      href={getAfipF960Url()}
      target="_F960AFIPInfo"
      rel="noopener noreferrer"
      className={`inline-block shrink-0 ${className}`}
      aria-label="AFIP — Data Fiscal"
    >
      <img
        src={AFIP_F960_IMAGE}
        alt="AFIP Data Fiscal"
        width={60}
        height={40}
        className="h-10 w-auto opacity-90 hover:opacity-100 transition-opacity"
        loading="lazy"
        decoding="async"
      />
    </a>
  )
}
