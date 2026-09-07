'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SUBJECT_COLORS, colorStyles } from '@/lib/colors'
import type { SubjectColor } from '@/types'

export function ColorPicker({
  value,
  onChange,
}: {
  value: SubjectColor
  onChange: (c: SubjectColor) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {SUBJECT_COLORS.map((c) => {
        const active = c === value
        return (
          <button
            key={c}
            type="button"
            aria-label={c}
            onClick={() => onChange(c)}
            className={cn(
              'flex size-8 items-center justify-center rounded-full ring-offset-2 ring-offset-background transition-all',
              colorStyles[c].dot,
              active ? 'ring-2 ring-foreground/60 scale-110' : 'hover:scale-105',
            )}
          >
            {active && <Check className="size-4 text-white" strokeWidth={3} />}
          </button>
        )
      })}
    </div>
  )
}
