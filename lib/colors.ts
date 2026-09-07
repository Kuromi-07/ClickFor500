import type { Priority, SubjectColor, DeadlineType, Status } from '@/types'

export const SUBJECT_COLORS: SubjectColor[] = [
  'blue', 'green', 'amber', 'rose', 'violet', 'cyan', 'orange', 'pink',
]

// Solid dot / accent classes and soft tinted background classes.
export const colorStyles: Record<
  SubjectColor,
  { dot: string; soft: string; text: string; ring: string; bar: string }
> = {
  blue: { dot: 'bg-blue-500', soft: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', ring: 'ring-blue-500/30', bar: 'bg-blue-500' },
  green: { dot: 'bg-emerald-500', soft: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', ring: 'ring-emerald-500/30', bar: 'bg-emerald-500' },
  amber: { dot: 'bg-amber-500', soft: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', ring: 'ring-amber-500/30', bar: 'bg-amber-500' },
  rose: { dot: 'bg-rose-500', soft: 'bg-rose-500/10', text: 'text-rose-600 dark:text-rose-400', ring: 'ring-rose-500/30', bar: 'bg-rose-500' },
  violet: { dot: 'bg-violet-500', soft: 'bg-violet-500/10', text: 'text-violet-600 dark:text-violet-400', ring: 'ring-violet-500/30', bar: 'bg-violet-500' },
  cyan: { dot: 'bg-cyan-500', soft: 'bg-cyan-500/10', text: 'text-cyan-600 dark:text-cyan-400', ring: 'ring-cyan-500/30', bar: 'bg-cyan-500' },
  orange: { dot: 'bg-orange-500', soft: 'bg-orange-500/10', text: 'text-orange-600 dark:text-orange-400', ring: 'ring-orange-500/30', bar: 'bg-orange-500' },
  pink: { dot: 'bg-pink-500', soft: 'bg-pink-500/10', text: 'text-pink-600 dark:text-pink-400', ring: 'ring-pink-500/30', bar: 'bg-pink-500' },
}

export const priorityMeta: Record<
  Priority,
  { label: string; className: string; order: number }
> = {
  urgent: { label: 'Urgent', className: 'bg-destructive/12 text-destructive border-destructive/20', order: 0 },
  high: { label: 'High', className: 'bg-orange-500/12 text-orange-600 dark:text-orange-400 border-orange-500/20', order: 1 },
  medium: { label: 'Medium', className: 'bg-amber-500/12 text-amber-600 dark:text-amber-400 border-amber-500/20', order: 2 },
  low: { label: 'Low', className: 'bg-muted text-muted-foreground border-border', order: 3 },
}

export const statusMeta: Record<Status, { label: string; className: string }> = {
  not_started: { label: 'Not Started', className: 'bg-muted text-muted-foreground border-border' },
  in_progress: { label: 'In Progress', className: 'bg-blue-500/12 text-blue-600 dark:text-blue-400 border-blue-500/20' },
  completed: { label: 'Completed', className: 'bg-success/15 text-success border-success/25' },
}

export const deadlineTypeMeta: Record<DeadlineType, { label: string }> = {
  assignment: { label: 'Assignment' },
  project: { label: 'Project' },
  quiz: { label: 'Quiz' },
  exam: { label: 'Exam' },
  presentation: { label: 'Presentation' },
  research: { label: 'Research' },
  other: { label: 'Other' },
}
