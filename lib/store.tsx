'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type {
  AppData,
  Deadline,
  Note,
  ScheduleEvent,
  Settings,
  StudySession,
  Subject,
  Task,
} from '@/types'
import { uid } from '@/lib/id'
import * as db from '@/lib/database/db'
import { buildSeed } from '@/lib/database/seed'

const DEFAULT_SETTINGS: Settings = {
  id: 'app',
  firstName: 'Student',
  theme: 'system',
  startDay: 1,
  timeFormat: '12h',
  defaultCalendarView: 'month',
  notifications: false,
  deadlineReminders: true,
  scheduleReminders: true,
  pomodoroStudy: 25,
  pomodoroBreak: 5,
}

const EMPTY: AppData = {
  subjects: [],
  schedules: [],
  deadlines: [],
  tasks: [],
  notes: [],
  sessions: [],
}

interface StoreContextValue {
  ready: boolean
  data: AppData
  settings: Settings
  // subjects
  addSubject: (s: Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Subject>
  updateSubject: (id: string, patch: Partial<Subject>) => Promise<void>
  deleteSubject: (id: string) => Promise<void>
  // schedules
  addSchedule: (s: Omit<ScheduleEvent, 'id' | 'createdAt' | 'updatedAt'>) => Promise<ScheduleEvent>
  updateSchedule: (id: string, patch: Partial<ScheduleEvent>) => Promise<void>
  deleteSchedule: (id: string) => Promise<void>
  duplicateSchedule: (id: string) => Promise<void>
  // deadlines
  addDeadline: (d: Omit<Deadline, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Deadline>
  updateDeadline: (id: string, patch: Partial<Deadline>) => Promise<void>
  deleteDeadline: (id: string) => Promise<void>
  // tasks
  addTask: (t: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => Promise<Task>
  updateTask: (id: string, patch: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  reorderTasks: (ids: string[]) => Promise<void>
  // notes
  addNote: (n: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Note>
  updateNote: (id: string, patch: Partial<Note>) => Promise<void>
  deleteNote: (id: string) => Promise<void>
  // sessions
  addSession: (s: Omit<StudySession, 'id'>) => Promise<void>
  // settings
  updateSettings: (patch: Partial<Settings>) => Promise<void>
  // data safety
  exportData: () => string
  importData: (json: string) => Promise<void>
  clearAllData: () => Promise<void>
  restore: (item: { kind: db.StoreName; value: unknown }) => Promise<void>
}

const StoreContext = createContext<StoreContextValue | null>(null)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)
  const [data, setData] = useState<AppData>(EMPTY)
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const existing = await db.getSettings()
        if (!existing) {
          const seed = buildSeed()
          await Promise.all([
            db.bulkPut('subjects', seed.subjects),
            db.bulkPut('schedules', seed.schedules),
            db.bulkPut('deadlines', seed.deadlines),
            db.bulkPut('tasks', seed.tasks),
            db.bulkPut('notes', seed.notes),
            db.put('settings', DEFAULT_SETTINGS),
          ])
        }
        const [subjects, schedules, deadlines, tasks, notes, sessions, loaded] =
          await Promise.all([
            db.getAll<Subject>('subjects'),
            db.getAll<ScheduleEvent>('schedules'),
            db.getAll<Deadline>('deadlines'),
            db.getAll<Task>('tasks'),
            db.getAll<Note>('notes'),
            db.getAll<StudySession>('sessions'),
            db.getSettings(),
          ])
        if (!mounted) return
        setData({ subjects, schedules, deadlines, tasks, notes, sessions })
        setSettings({ ...DEFAULT_SETTINGS, ...(loaded ?? {}) })
      } catch (e) {
        console.log('[v0] store init failed:', (e as Error).message)
      } finally {
        if (mounted) setReady(true)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const now = () => Date.now()

  // --- Subjects ---
  const addSubject = useCallback<StoreContextValue['addSubject']>(async (s) => {
    const item: Subject = { ...s, id: uid(), createdAt: now(), updatedAt: now() }
    await db.put('subjects', item)
    setData((d) => ({ ...d, subjects: [...d.subjects, item] }))
    return item
  }, [])

  const updateSubject = useCallback<StoreContextValue['updateSubject']>(async (id, patch) => {
    setData((d) => {
      const next = d.subjects.map((x) => (x.id === id ? { ...x, ...patch, updatedAt: now() } : x))
      const updated = next.find((x) => x.id === id)
      if (updated) void db.put('subjects', updated)
      return { ...d, subjects: next }
    })
  }, [])

  const deleteSubject = useCallback<StoreContextValue['deleteSubject']>(async (id) => {
    await db.remove('subjects', id)
    setData((d) => ({ ...d, subjects: d.subjects.filter((x) => x.id !== id) }))
  }, [])

  // --- Schedules ---
  const addSchedule = useCallback<StoreContextValue['addSchedule']>(async (s) => {
    const item: ScheduleEvent = { ...s, id: uid(), createdAt: now(), updatedAt: now() }
    await db.put('schedules', item)
    setData((d) => ({ ...d, schedules: [...d.schedules, item] }))
    return item
  }, [])

  const updateSchedule = useCallback<StoreContextValue['updateSchedule']>(async (id, patch) => {
    setData((d) => {
      const next = d.schedules.map((x) => (x.id === id ? { ...x, ...patch, updatedAt: now() } : x))
      const updated = next.find((x) => x.id === id)
      if (updated) void db.put('schedules', updated)
      return { ...d, schedules: next }
    })
  }, [])

  const deleteSchedule = useCallback<StoreContextValue['deleteSchedule']>(async (id) => {
    await db.remove('schedules', id)
    setData((d) => ({ ...d, schedules: d.schedules.filter((x) => x.id !== id) }))
  }, [])

  const duplicateSchedule = useCallback<StoreContextValue['duplicateSchedule']>(async (id) => {
    setData((d) => {
      const src = d.schedules.find((x) => x.id === id)
      if (!src) return d
      const copy: ScheduleEvent = { ...src, id: uid(), title: `${src.title} (copy)`, completed: false, createdAt: now(), updatedAt: now() }
      void db.put('schedules', copy)
      return { ...d, schedules: [...d.schedules, copy] }
    })
  }, [])

  // --- Deadlines ---
  const addDeadline = useCallback<StoreContextValue['addDeadline']>(async (item0) => {
    const item: Deadline = { ...item0, id: uid(), createdAt: now(), updatedAt: now() }
    await db.put('deadlines', item)
    setData((d) => ({ ...d, deadlines: [...d.deadlines, item] }))
    return item
  }, [])

  const updateDeadline = useCallback<StoreContextValue['updateDeadline']>(async (id, patch) => {
    setData((d) => {
      const next = d.deadlines.map((x) => (x.id === id ? { ...x, ...patch, updatedAt: now() } : x))
      const updated = next.find((x) => x.id === id)
      if (updated) void db.put('deadlines', updated)
      return { ...d, deadlines: next }
    })
  }, [])

  const deleteDeadline = useCallback<StoreContextValue['deleteDeadline']>(async (id) => {
    await db.remove('deadlines', id)
    setData((d) => ({ ...d, deadlines: d.deadlines.filter((x) => x.id !== id) }))
  }, [])

  // --- Tasks ---
  const addTask = useCallback<StoreContextValue['addTask']>(async (t) => {
    let created: Task | null = null
    setData((d) => {
      const order = d.tasks.length
      const item: Task = { ...t, id: uid(), order, createdAt: now(), updatedAt: now() }
      created = item
      void db.put('tasks', item)
      return { ...d, tasks: [...d.tasks, item] }
    })
    return created as unknown as Task
  }, [])

  const updateTask = useCallback<StoreContextValue['updateTask']>(async (id, patch) => {
    setData((d) => {
      const next = d.tasks.map((x) => (x.id === id ? { ...x, ...patch, updatedAt: now() } : x))
      const updated = next.find((x) => x.id === id)
      if (updated) void db.put('tasks', updated)
      return { ...d, tasks: next }
    })
  }, [])

  const deleteTask = useCallback<StoreContextValue['deleteTask']>(async (id) => {
    await db.remove('tasks', id)
    setData((d) => ({ ...d, tasks: d.tasks.filter((x) => x.id !== id) }))
  }, [])

  const reorderTasks = useCallback<StoreContextValue['reorderTasks']>(async (ids) => {
    setData((d) => {
      const map = new Map(d.tasks.map((t) => [t.id, t]))
      const reordered = ids
        .map((id, i) => {
          const t = map.get(id)
          return t ? { ...t, order: i, updatedAt: now() } : null
        })
        .filter(Boolean) as Task[]
      void db.bulkPut('tasks', reordered)
      return { ...d, tasks: reordered }
    })
  }, [])

  // --- Notes ---
  const addNote = useCallback<StoreContextValue['addNote']>(async (n) => {
    const item: Note = { ...n, id: uid(), createdAt: now(), updatedAt: now() }
    await db.put('notes', item)
    setData((d) => ({ ...d, notes: [...d.notes, item] }))
    return item
  }, [])

  const updateNote = useCallback<StoreContextValue['updateNote']>(async (id, patch) => {
    setData((d) => {
      const next = d.notes.map((x) => (x.id === id ? { ...x, ...patch, updatedAt: now() } : x))
      const updated = next.find((x) => x.id === id)
      if (updated) void db.put('notes', updated)
      return { ...d, notes: next }
    })
  }, [])

  const deleteNote = useCallback<StoreContextValue['deleteNote']>(async (id) => {
    await db.remove('notes', id)
    setData((d) => ({ ...d, notes: d.notes.filter((x) => x.id !== id) }))
  }, [])

  // --- Sessions ---
  const addSession = useCallback<StoreContextValue['addSession']>(async (s) => {
    const item: StudySession = { ...s, id: uid() }
    await db.put('sessions', item)
    setData((d) => ({ ...d, sessions: [...d.sessions, item] }))
  }, [])

  // --- Settings ---
  const updateSettings = useCallback<StoreContextValue['updateSettings']>(async (patch) => {
    setSettings((s) => {
      const next = { ...s, ...patch }
      void db.put('settings', next)
      return next
    })
  }, [])

  // --- Data safety ---
  const exportData = useCallback<StoreContextValue['exportData']>(() => {
    return JSON.stringify({ version: 1, exportedAt: Date.now(), data, settings }, null, 2)
  }, [data, settings])

  const importData = useCallback<StoreContextValue['importData']>(async (json) => {
    const parsed = JSON.parse(json)
    const incoming: AppData = parsed.data ?? parsed
    await db.clearAll()
    await Promise.all([
      db.bulkPut('subjects', incoming.subjects ?? []),
      db.bulkPut('schedules', incoming.schedules ?? []),
      db.bulkPut('deadlines', incoming.deadlines ?? []),
      db.bulkPut('tasks', incoming.tasks ?? []),
      db.bulkPut('notes', incoming.notes ?? []),
      db.bulkPut('sessions', incoming.sessions ?? []),
    ])
    const nextSettings = { ...DEFAULT_SETTINGS, ...(parsed.settings ?? {}) }
    await db.put('settings', nextSettings)
    setData({
      subjects: incoming.subjects ?? [],
      schedules: incoming.schedules ?? [],
      deadlines: incoming.deadlines ?? [],
      tasks: incoming.tasks ?? [],
      notes: incoming.notes ?? [],
      sessions: incoming.sessions ?? [],
    })
    setSettings(nextSettings)
  }, [])

  const clearAllData = useCallback<StoreContextValue['clearAllData']>(async () => {
    await db.clearAll()
    await db.put('settings', settings)
    setData(EMPTY)
  }, [settings])

  const restore = useCallback<StoreContextValue['restore']>(async (item) => {
    await db.put(item.kind, item.value)
    const kind = item.kind
    if (kind === 'settings') return
    setData((d) => ({ ...d, [kind]: [...(d as any)[kind], item.value] }))
  }, [])

  const value = useMemo<StoreContextValue>(
    () => ({
      ready,
      data,
      settings,
      addSubject,
      updateSubject,
      deleteSubject,
      addSchedule,
      updateSchedule,
      deleteSchedule,
      duplicateSchedule,
      addDeadline,
      updateDeadline,
      deleteDeadline,
      addTask,
      updateTask,
      deleteTask,
      reorderTasks,
      addNote,
      updateNote,
      deleteNote,
      addSession,
      updateSettings,
      exportData,
      importData,
      clearAllData,
      restore,
    }),
    [
      ready, data, settings, addSubject, updateSubject, deleteSubject,
      addSchedule, updateSchedule, deleteSchedule, duplicateSchedule,
      addDeadline, updateDeadline, deleteDeadline, addTask, updateTask,
      deleteTask, reorderTasks, addNote, updateNote, deleteNote, addSession,
      updateSettings, exportData, importData, clearAllData, restore,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}

export function useSubjectMap() {
  const { data } = useStore()
  return useMemo(() => {
    const map = new Map<string, Subject>()
    for (const s of data.subjects) map.set(s.id, s)
    return map
  }, [data.subjects])
}
