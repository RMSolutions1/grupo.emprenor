import type { ReactNode } from 'react'

export function AdminTabs({ tabs, active, onChange }: {
  tabs: { id: string; label: string; icon?: string }[]
  active: string
  onChange: (id: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-background-200">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-body font-medium transition-all ${
            active === tab.id
              ? 'bg-primary-500 text-white shadow-md'
              : 'bg-background-100 text-foreground-600 hover:bg-background-200'
          }`}
        >
          {tab.icon && <i className={tab.icon} />}
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export function AdminTabPanel({ active, id, children }: { active: string; id: string; children: ReactNode }) {
  if (active !== id) return null
  return <div>{children}</div>
}
