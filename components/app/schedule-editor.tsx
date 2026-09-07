'use client'

import { useEffect, useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Field } from '@/components/ui/label'
import { SubjectSelect } from '@/components/shared/subject-select'
import { ColorPicker } from '@/components/shared/color-picker'
import { useStore } from '@/lib/store'
import { useAppUI } from '@/components/app/ui-context'
import { useToast } from '@/components/ui/toast'
import { todayISO } from '@/lib/date'
import type { RepeatOption, SubjectColor } from '@/types'

export function ScheduleEditor() {
  const { scheduleEditor, closeScheduleEditor } = useAppUI()
  const { addSchedule, updateSchedule, data } = useStore()
  const { toast } = useToast()

  const editing = scheduleEditor.editing
  const [title, setTitle] = useState('')
  const [subjectId, setSubjectId] = useState<string | undefined>(undefined)
  const [date, setDate] = useState(todayISO())
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:00')
  const [location, setLocation] = useState('')
  const [teacher, setTeacher] = useState('')
  const [notes, setNotes] = useState('')
  const [color, setColor] = useState<SubjectColor>('blue')
  const [repeat, setRepeat] = useState<RepeatOption>('none')

  useEffect(() => {
    if (!scheduleEditor.open) return
    const src = scheduleEditor.editing
    const def = scheduleEditor.defaults
    setTitle(src?.title ?? '')
    setSubjectId(src?.subjectId ?? def?.subjectId)
    setDate(src?.date ?? def?.date ?? todayISO())
    setStartTime(src?.startTime ?? '09:00')
    setEndTime(src?.endTime ?? '10:00')
    setLocation(src?.location ?? '')
    setTeacher(src?.teacher ?? '')
    setNotes(src?.notes ?? '')
    setColor(src?.color ?? 'blue')
    setRepeat(src?.repeat ?? 'none')
  }, [scheduleEditor])

  // Auto-fill color/teacher from subject when picking one for a new event
  useEffect(() => {
    if (!subjectId || editing) return
    const s = data.subjects.find((x) => x.id === subjectId)
    if (s) {
      setColor(s.color)
      if (s.teacher) setTeacher(s.teacher)
      if (s.room) setLocation(s.room)
    }
  }, [subjectId, editing, data.subjects])

  const save = async () => {
    if (!title.trim()) {
      toast('Please add a title.', { tone: 'warning' })
      return
    }
    const payload = {
      title: title.trim(),
      subjectId,
      date,
      startTime,
      endTime,
      location: location.trim() || undefined,
      teacher: teacher.trim() || undefined,
      notes: notes.trim() || undefined,
      color,
      repeat,
      completed: editing?.completed ?? false,
    }
    if (editing) {
      await updateSchedule(editing.id, payload)
      toast('Schedule updated.', { tone: 'success' })
    } else {
      await addSchedule(payload)
      toast('Schedule added.', { tone: 'success' })
    }
    closeScheduleEditor()
  }

  return (
    <Modal
      open={scheduleEditor.open}
      onClose={closeScheduleEditor}
      title={editing ? 'Edit schedule' : 'Add schedule'}
      description="Create a class or study block."
      size="lg"
      footer={
        <>
          <Button variant="outline" size="lg" onClick={closeScheduleEditor}>Cancel</Button>
          <Button size="lg" onClick={save}>{editing ? 'Save changes' : 'Add schedule'}</Button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title" className="sm:col-span-2">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. C++ Laboratory" autoFocus />
        </Field>
        <Field label="Subject">
          <SubjectSelect value={subjectId} onChange={setSubjectId} />
        </Field>
        <Field label="Date">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label="Start time">
          <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        </Field>
        <Field label="End time">
          <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        </Field>
        <Field label="Location">
          <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Room / Lab" />
        </Field>
        <Field label="Teacher">
          <Input value={teacher} onChange={(e) => setTeacher(e.target.value)} placeholder="Instructor" />
        </Field>
        <Field label="Repeat">
          <Select value={repeat} onChange={(e) => setRepeat(e.target.value as RepeatOption)}>
            <option value="none">Does not repeat</option>
            <option value="daily">Every day</option>
            <option value="weekly">Every week</option>
            <option value="weekdays">Every weekday</option>
            <option value="custom">Custom</option>
          </Select>
        </Field>
        <Field label="Color">
          <div className="pt-1"><ColorPicker value={color} onChange={setColor} /></div>
        </Field>
        <Field label="Notes" className="sm:col-span-2">
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional details" />
        </Field>
      </div>
    </Modal>
  )
}
