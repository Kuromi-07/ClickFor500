import {
  LayoutDashboard,
  Calendar,
  Clock,
  AlarmClock,
  ListTodo,
  NotebookPen,
  BookOpen,
  Timer,
  BarChart3,
  Settings,
  type LucideIcon,
} from 'lucide-react'
import type { ViewId } from '@/components/app/ui-context'

export interface NavItem {
  id: ViewId
  label: string
  icon: LucideIcon
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'schedule', label: 'Schedule', icon: Clock },
  { id: 'deadlines', label: 'Deadlines', icon: AlarmClock },
  { id: 'tasks', label: 'Tasks', icon: ListTodo },
  { id: 'notes', label: 'Notes', icon: NotebookPen },
  { id: 'subjects', label: 'Subjects', icon: BookOpen },
  { id: 'timer', label: 'Study Timer', icon: Timer },
  { id: 'progress', label: 'Progress', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export const MOBILE_NAV: ViewId[] = ['dashboard', 'calendar', 'deadlines', 'tasks', 'notes']
