'use client'

import { useEffect, useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Field } from '@/components/ui/label'
import { SubjectSelect } from '@/components/shared/subject-select'
import { useStore } from '@/lib/store'
import { useAppUI } from '@/components/app/ui-context'
import { useToast } from '@/components/ui/toast'
import { todayISO } from '@/lib/date'
import type { DeadlineType, Priority, Status } from '@/types'

export function DeadlineEditor() {
  const { deadlineEditor, closeDeadlineEditor } = useAppUI()
  const { addDeadline, updateDeadline } = useStore()
  const { toast } = useToast()

  const editing = deadlineEditor.editing
  const [title, setTitle] = useState('')
  const [type, setType] = useState<DeadlineType>('assignment')
  const [subjectId, setSubjectId] = useState<string | undefined>()
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState(todayISO())
  const [dueTime, setDueTime] = useState('23:59')
  const [priority, setPriority] = useState<Priority>('medium')
  const [status, setStatus] = useState<Status>('not_started')
  const [attachmentName, setAttachmentName] = useState('')

  useEffect(() => {
    if (!deadlineEditor.open) return
    const src = deadlineEditor.editing
    const def = deadlineEditor.defaults
    setTitle(src?.title ?? '')
    setType(src?.type ?? 'assignment')
    setSubjectId(src?.subjectId ?? def?.subjectId)
    setDescription(src?.description ?? '')
    setDueDate(src?.dueDate ?? def?.dueDate ?? todayISO())
    setDueTime(src?.dueTime ?? '23:59')
    setPriority(src?.priority ?? 'medium')
    setStatus(src?.status ?? 'not_started')
    setAttachmentName(src?.attachmentName ?? '')
  }, [deadlineEditor])

  const save = async () => {
    if (!title.trim()) {
      toast('Please add a title.', { tone: 'warning' })
      return
    }
    const payload = {
      title: title.trim(),
      type,
      subjectId,
      description: description.trim() || undefined,
      dueDate,
      dueTime,
      priority,
      status,
      attachmentName: attachmentName.trim() || undefined,
    }
    if (editing) {
      await updateDeadline(editing.id, payload)
      toast('Deadline updated.', { tone: 'success' })
    } else {
      await addDeadline(payload)
      toast('Deadline added.', { tone: 'success' })
    }
    closeDeadlineEditor()
  }

  return (
    <Modal
      open={deadlineEditor.open}
      onClose={closeDeadlineEditor}
      title={editing ? 'Edit deadline' : 'Add deadline'}
      description="Track an assignment, quiz, exam and more."
      size="lg"
      footer={
        <>
          <Button variant="outline" size="lg" onClick={closeDeadlineEditor}>Cancel</Button>
          <Button size="lg" onClick={save}>{editing ? 'Save changes' : 'Add deadline'}</Button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title" className="sm:col-span-2">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Programming Activity #4" autoFocus />
        </Field>
        <Field label="Type">
          <Select value={type} onChange={(e) => setType(e.target.value as DeadlineType)}>
            <option value="assignment">Assignment</option>
            <option value="project">Project</option>
            <option value="quiz">Quiz</option>
            <option value="exam">Exam</option>
            <option value="presentation">Presentation</option>
            <option value="research">Research</option>
            <option value="other">Other</option>
          </Select>
        </Field>
        <Field label="Subject">
          <SubjectSelect value={subjectId} onChange={setSubjectId} />
        </Field>
        <Field label="Due date">
          <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </Field>
        <Field label="Due time">
          <Input type="time" value={dueTime} onChange={(e) => setDueTime(e.target.value)} />
        </Field>
        <Field label="Priority">
          <Select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </Select>
        </Field>
        <Field label="Status">
          <Select value={status} onChange={(e) => setStatus(e.target.value as Status)}>
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </Select>
        </Field>
        <Field label="Attachment name" className="sm:col-span-2">
          <Input value={attachmentName} onChange={(e) => setAttachmentName(e.target.value)} placeholder="e.g. brief.pdf (optional)" />
        </Field>
        <Field label="Description" className="sm:col-span-2">
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional details" />
        </Field>
      </div>
    </Modal>
  )
}
