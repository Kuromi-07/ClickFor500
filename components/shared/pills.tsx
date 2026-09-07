import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { colorStyles, priorityMeta, statusMeta } from '@/lib/colors'
import type { Priority, Status, Subject } from '@/types'

export function PriorityBadge({ priority }: { priority: Priority }) {
  const meta = priorityMeta[priority]
  return <Badge className={meta.className}>{meta.label}</Badge>
}

export function StatusBadge({ status }: { status: Status }) {
  const meta = statusMeta[status]
  return <Badge className={meta.className}>{meta.label}</Badge>
}

export function SubjectTag({
  subject,
  className,
}: {
  subject?: Subject
  className?: string
}) {
  if (!subject) return null
  const c = colorStyles[subject.color]
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground', className)}>
      <span className={cn('size-2 rounded-full', c.dot)} />
      {subject.name}
    </span>
  )
}

export function ColorDot({ color, className }: { color: Subject['color']; className?: string }) {
  return <span className={cn('size-2.5 rounded-full', colorStyles[color].dot, className)} />
}
