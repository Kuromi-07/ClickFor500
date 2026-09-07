export type ID = string

export type SubjectColor =
  | 'blue'
  | 'green'
  | 'amber'
  | 'rose'
  | 'violet'
  | 'cyan'
  | 'orange'
  | 'pink'

export interface Subject {
  id: ID
  name: string
  teacher?: string
  room?: string
  color: SubjectColor
  notes?: string
  createdAt: number
  updatedAt: number
}

export type RepeatOption =
  | 'none'
  | 'daily'
  | 'weekly'
  | 'weekdays'
  | 'custom'

export interface ScheduleEvent {
  id: ID
  title: string
  subjectId?: ID
  date: string // YYYY-MM-DD
  startTime: string // HH:mm
  endTime: string // HH:mm
  location?: string
  teacher?: string
  notes?: string
  color: SubjectColor
  repeat: RepeatOption
  repeatDays?: number[] // 0-6 for custom
  completed: boolean
  createdAt: number
  updatedAt: number
}

export type DeadlineType =
  | 'assignment'
  | 'project'
  | 'quiz'
  | 'exam'
  | 'presentation'
  | 'research'
  | 'other'

export type Priority = 'low' | 'medium' | 'high' | 'urgent'
export type Status = 'not_started' | 'in_progress' | 'completed'

export interface Deadline {
  id: ID
  title: string
  type: DeadlineType
  subjectId?: ID
  description?: string
  dueDate: string // YYYY-MM-DD
  dueTime?: string // HH:mm
  priority: Priority
  attachmentName?: string
  status: Status
  createdAt: number
  updatedAt: number
}

export type TaskType =
  | 'homework'
  | 'study'
  | 'assignment'
  | 'project'
  | 'personal'

export interface Task {
  id: ID
  title: string
  description?: string
  type: TaskType
  dueDate?: string
  priority: Priority
  subjectId?: ID
  completed: boolean
  order: number
  createdAt: number
  updatedAt: number
}

export interface Note {
  id: ID
  title: string
  content: string // HTML
  subjectId?: ID
  tags: string[]
  pinned: boolean
  archived: boolean
  createdAt: number
  updatedAt: number
}

export interface StudySession {
  id: ID
  startedAt: number
  durationMinutes: number
  subjectId?: ID
  mode: 'pomodoro' | 'custom'
}

export type ThemePref = 'light' | 'dark' | 'system'
export type CalendarView = 'month' | 'week' | 'day'

export interface Settings {
  id: 'app'
  firstName: string
  theme: ThemePref
  startDay: 0 | 1 // Sunday or Monday
  timeFormat: '12h' | '24h'
  defaultCalendarView: CalendarView
  notifications: boolean
  deadlineReminders: boolean
  scheduleReminders: boolean
  pomodoroStudy: number
  pomodoroBreak: number
}

export type EntityKind =
  | 'subjects'
  | 'schedules'
  | 'deadlines'
  | 'tasks'
  | 'notes'
  | 'sessions'

export interface AppData {
  subjects: Subject[]
  schedules: ScheduleEvent[]
  deadlines: Deadline[]
  tasks: Task[]
  notes: Note[]
  sessions: StudySession[]
}
