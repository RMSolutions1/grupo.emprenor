import { Link } from 'react-router-dom'

export interface BreadcrumbItem {
  label: string
  to?: string
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[]
}

export default function Breadcrumb({ items = [] }: BreadcrumbProps) {
  const crumbs: BreadcrumbItem[] = [{ label: 'Inicio', to: '/' }, ...items]

  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-body text-foreground-500 list-none p-0 m-0">
        {crumbs.map((item, index) => {
          const isLast = index === crumbs.length - 1
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 && <span aria-hidden="true" className="text-foreground-300">/</span>}
              {isLast || !item.to ? (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className={isLast ? 'text-foreground-700 font-medium' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link to={item.to} className="inline-flex items-center gap-1.5 hover:text-accent-500 transition-colors">
                  {index === 0 && <i className="ri-home-4-line text-base" aria-hidden="true" />}
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
