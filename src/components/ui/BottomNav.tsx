import { BookOpen, Camera, House, User } from 'lucide-react'
import { cn } from '../../lib/cn'

export type Tab = 'home' | 'learn' | 'practice' | 'profile'

const TABS = [
  { id: 'home', label: 'Home', Icon: House },
  { id: 'learn', label: 'Learn', Icon: BookOpen },
  { id: 'practice', label: 'Practice', Icon: Camera },
  { id: 'profile', label: 'Profile', Icon: User },
] as const

type BottomNavProps = {
  active: Tab
  onSelect: (tab: Tab) => void
}

export function BottomNav({ active, onSelect }: BottomNavProps) {
  return (
    <nav className="pb-safe flex shrink-0 gap-1 border-t border-line bg-paper px-4 pt-2">
      {TABS.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          aria-current={active === id ? 'page' : undefined}
          onClick={() => onSelect(id)}
          className={cn(
            'flex flex-1 flex-col items-center gap-0.5 rounded-2xl py-2 text-sm font-extrabold text-ink',
            active === id && 'bg-mint-light',
          )}
        >
          <Icon className={cn('size-6', active === id && 'text-periwinkle')} />
          {label}
        </button>
      ))}
    </nav>
  )
}
