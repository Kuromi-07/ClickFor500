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
import type { Priority, TaskType } from '@/types'

export function TaskEditor() {
  const { taskEditor, closeTaskEditor } = useAppUI()
  const { addTask, updateTask } = useStore()
  const { toast } = useToast()

  const editing = taskEditor.editing
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<TaskType>('homework')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [subjectId, setSubjectId] = useState<string | undefined>()

  useEffect(() => {
    if (!taskEditor.open) return
    const src = taskEditor.editing
    const def = taskEditor.defaults
    setTitle(src?.title ?? '')
    setDescription(src?.description ?? '')
    setType(src?.type ?? 'homework')
    setDueDate(src?.dueDate ?? def?.dueDate ?? '')
    setPriority(src?.priority ?? 'medium')
    setSubjectId(src?.subjectId ?? def?.subjectId)
  }, [taskEditor])

  const save = async () => {
    if (!title.trim()) {
      toast('Please add a title.', { tone: 'warning' })
      return
    }
    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      type,
      dueDate: dueDate || undefined,
      priority,
      subjectId,
      completed: editing?.completed ?? false,
    }
    if (editing) {
      await updateTask(editing.id, payload)
      toast('Task updated.', { tone: 'success' })
    } else {
      await addTask(payload)
      toast('Task added.', { tone: 'success' })
    }
    closeTaskEditor()
  }

  return (
    <Modal
      open={taskEditor.open}
      onClose={closeTaskEditor}
      title={editing ? 'Edit task' : 'Add task'}
      description="A quick to-do to keep you on track."
      size="md"
      footer={
        <>
          <Button variant="outline" size="lg" onClick={closeTaskEditor}>Cancel</Button>
          <Button size="lg" onClick={save}>{editing ? 'Save changes' : 'Add task'}</Button>
        </>
      }
    >
      <div className="grid gap-4">
        <Field label="Title">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Read Chapter 5" autoFocus />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Type">
            <Select value={type} onChange={(e) => setType(e.target.value as TaskType)}>
              <option value="homework">Homework</option>
              <option value="study">Study task</option>
              <option value="assignment">Assignment</option>
              <option value="project">Project task</option>
              <option value="personal">Personal task</option>
            </Select>
          </Field>
          <Field label="Priority">
            <Select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </Select>
          </Field>
          <Field label="Subject">
            <SubjectSelect value={subjectId} onChange={setSubjectId} />
          </Field>
          <Field label="Due date">
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </Field>
        </div>
        <Field label="Description">
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional details" />
        </Field>
      </div>
    </Modal>
  )
}
