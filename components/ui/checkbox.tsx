'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Checkbox({
  checked,
  onCheckedChange,
  className,
  'aria-label': ariaLabel,
}: {
  checked: boolean
  onCheckedChange: (v: boolean) => void
  className?: string
  'aria-label'?: string
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        'flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-200',
        'focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none',
        checked
          ? 'border-primary bg-primary text-primary-foreground scale-100'
          : 'border-muted-foreground/40 bg-transparent hover:border-primary/60',
        className,
      )}
    >
      <Check
        className={cn(
          'size-3.5 transition-all duration-200',
          checked ? 'scale-100 opacity-100' : 'scale-50 opacity-0',
        )}
        strokeWidth={3}
      />
    </button>
  )
}
