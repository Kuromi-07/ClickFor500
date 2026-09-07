'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { Deadline, Note, ScheduleEvent, Task } from '@/types'

export type ViewId =
  | 'dashboard'
  | 'calendar'
  | 'schedule'
  | 'deadlines'
  | 'tasks'
  | 'notes'
  | 'subjects'
  | 'timer'
  | 'progress'
  | 'settings'

interface EditorState<T> {
  open: boolean
  editing?: T
  defaults?: Partial<T>
}

interface AppUIValue {
  view: ViewId
  setView: (v: ViewId) => void
  activeSubjectId: string | null
  openSubject: (id: string) => void
  clearSubject: () => void

  scheduleEditor: EditorState<ScheduleEvent>
  openScheduleEditor: (opts?: { editing?: ScheduleEvent; defaults?: Partial<ScheduleEvent> }) => void
  closeScheduleEditor: () => void

  deadlineEditor: EditorState<Deadline>
  openDeadlineEditor: (opts?: { editing?: Deadline; defaults?: Partial<Deadline> }) => void
  closeDeadlineEditor: () => void

  taskEditor: EditorState<Task>
  openTaskEditor: (opts?: { editing?: Task; defaults?: Partial<Task> }) => void
  closeTaskEditor: () => void

  noteEditorId: string | null | 'new'
  openNoteEditor: (id: string | 'new') => void
  closeNoteEditor: () => void
}

const AppUIContext = createContext<AppUIValue | null>(null)

export function AppUIProvider({ children }: { children: React.ReactNode }) {
  const [view, setViewState] = useState<ViewId>('dashboard')
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null)
  const [scheduleEditor, setScheduleEditor] = useState<EditorState<ScheduleEvent>>({ open: false })
  const [deadlineEditor, setDeadlineEditor] = useState<EditorState<Deadline>>({ open: false })
  const [taskEditor, setTaskEditor] = useState<EditorState<Task>>({ open: false })
  const [noteEditorId, setNoteEditorId] = useState<string | null | 'new'>(null)

  const setView = useCallback((v: ViewId) => {
    setViewState(v)
    if (v !== 'subjects') setActiveSubjectId(null)
    if (typeof window !== 'undefined') window.scrollTo({ top: 0 })
  }, [])

  const openSubject = useCallback((id: string) => {
    setActiveSubjectId(id)
    setViewState('subjects')
  }, [])

  const value = useMemo<AppUIValue>(
    () => ({
      view,
      setView,
      activeSubjectId,
      openSubject,
      clearSubject: () => setActiveSubjectId(null),
      scheduleEditor,
      openScheduleEditor: (opts) => setScheduleEditor({ open: true, ...opts }),
      closeScheduleEditor: () => setScheduleEditor({ open: false }),
      deadlineEditor,
      openDeadlineEditor: (opts) => setDeadlineEditor({ open: true, ...opts }),
      closeDeadlineEditor: () => setDeadlineEditor({ open: false }),
      taskEditor,
      openTaskEditor: (opts) => setTaskEditor({ open: true, ...opts }),
      closeTaskEditor: () => setTaskEditor({ open: false }),
      noteEditorId,
      openNoteEditor: (id) => setNoteEditorId(id),
      closeNoteEditor: () => setNoteEditorId(null),
    }),
    [view, setView, activeSubjectId, openSubject, scheduleEditor, deadlineEditor, taskEditor, noteEditorId],
  )

  return <AppUIContext.Provider value={value}>{children}</AppUIContext.Provider>
}

export function useAppUI() {
  const ctx = useContext(AppUIContext)
  if (!ctx) throw new Error('useAppUI must be used within AppUIProvider')
  return ctx
}
