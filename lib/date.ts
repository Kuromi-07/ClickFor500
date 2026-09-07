export function todayISO(): string {
  return toISODate(new Date())
}

export function toISODate(d: Date): string {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}

export function addDays(d: Date, days: number): Date {
  const next = new Date(d)
  next.setDate(next.getDate() + days)
  return next
}

export function startOfWeek(d: Date, weekStart: 0 | 1 = 1): Date {
  const date = new Date(d)
  const day = date.getDay()
  const diff = (day - weekStart + 7) % 7
  date.setDate(date.getDate() - diff)
  date.setHours(0, 0, 0, 0)
  return date
}

export function isSameDay(a: Date, b: Date): boolean {
  return toISODate(a) === toISODate(b)
}

export function daysBetween(fromISO: string, toISO: string): number {
  const a = parseISO(fromISO).getTime()
  const b = parseISO(toISO).getTime()
  return Math.round((b - a) / 86_400_000)
}

export function greeting(d = new Date()): string {
  const h = d.getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export function formatLongDate(d = new Date()): string {
  return d.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatTime(time: string, format: '12h' | '24h' = '12h'): string {
  if (!time) return ''
  const [hStr, mStr] = time.split(':')
  const h = Number(hStr)
  const m = mStr ?? '00'
  if (format === '24h') return `${String(h).padStart(2, '0')}:${m}`
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12}:${m} ${period}`
}

export function relativeSaved(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000)
  if (diff < 5) return 'Saved just now'
  if (diff < 60) return `Saved ${diff} seconds ago`
  const mins = Math.floor(diff / 60)
  if (mins < 60) return `Saved ${mins} minute${mins > 1 ? 's' : ''} ago`
  const hrs = Math.floor(mins / 60)
  return `Saved ${hrs} hour${hrs > 1 ? 's' : ''} ago`
}

export function dueLabel(dueDate: string): {
  label: string
  tone: 'overdue' | 'today' | 'tomorrow' | 'week' | 'later'
} {
  const diff = daysBetween(todayISO(), dueDate)
  if (diff < 0) return { label: `Overdue by ${Math.abs(diff)}d`, tone: 'overdue' }
  if (diff === 0) return { label: 'Due today', tone: 'today' }
  if (diff === 1) return { label: 'Due tomorrow', tone: 'tomorrow' }
  if (diff <= 7) return { label: `Due in ${diff} days`, tone: 'week' }
  return { label: parseISO(dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), tone: 'later' }
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return (h || 0) * 60 + (m || 0)
}

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
