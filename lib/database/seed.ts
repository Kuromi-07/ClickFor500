import type { AppData } from '@/types'
import { uid } from '@/lib/id'
import { todayISO, toISODate, addDays } from '@/lib/date'

export function buildSeed(): AppData {
  const now = Date.now()
  const s1 = uid()
  const s2 = uid()
  const s3 = uid()
  const s4 = uid()

  const today = todayISO()
  const tomorrow = toISODate(addDays(new Date(), 1))
  const in3 = toISODate(addDays(new Date(), 3))
  const in5 = toISODate(addDays(new Date(), 5))

  return {
    subjects: [
      { id: s1, name: 'Programming 1', teacher: 'Prof. Reyes', room: 'Comp Lab', color: 'blue', createdAt: now, updatedAt: now },
      { id: s2, name: 'Mathematics', teacher: 'Ms. Cruz', room: 'Room 204', color: 'green', createdAt: now, updatedAt: now },
      { id: s3, name: 'English', teacher: 'Mr. Santos', room: 'Room 110', color: 'amber', createdAt: now, updatedAt: now },
      { id: s4, name: 'Research', teacher: 'Dr. Lim', room: 'Library', color: 'violet', createdAt: now, updatedAt: now },
    ],
    schedules: [
      { id: uid(), title: 'C++ Laboratory', subjectId: s1, date: today, startTime: '13:00', endTime: '15:00', location: 'Computer Laboratory', teacher: 'Prof. Reyes', color: 'blue', repeat: 'weekly', completed: false, createdAt: now, updatedAt: now },
      { id: uid(), title: 'Calculus Lecture', subjectId: s2, date: today, startTime: '09:00', endTime: '10:30', location: 'Room 204', teacher: 'Ms. Cruz', color: 'green', repeat: 'weekly', completed: false, createdAt: now, updatedAt: now },
      { id: uid(), title: 'Literature Discussion', subjectId: s3, date: tomorrow, startTime: '11:00', endTime: '12:00', location: 'Room 110', teacher: 'Mr. Santos', color: 'amber', repeat: 'weekly', completed: false, createdAt: now, updatedAt: now },
    ],
    deadlines: [
      { id: uid(), title: 'Programming Activity #4', type: 'assignment', subjectId: s1, description: 'Build a linked list in C++.', dueDate: tomorrow, dueTime: '23:59', priority: 'high', status: 'in_progress', createdAt: now, updatedAt: now },
      { id: uid(), title: 'Math Problem Set 3', type: 'assignment', subjectId: s2, dueDate: in3, dueTime: '17:00', priority: 'medium', status: 'not_started', createdAt: now, updatedAt: now },
      { id: uid(), title: 'Research Paper Outline', type: 'research', subjectId: s4, dueDate: in5, dueTime: '23:59', priority: 'urgent', status: 'not_started', createdAt: now, updatedAt: now },
    ],
    tasks: [
      { id: uid(), title: 'Read Chapter 5', type: 'study', subjectId: s2, dueDate: today, priority: 'medium', completed: false, order: 0, createdAt: now, updatedAt: now },
      { id: uid(), title: 'Draft essay introduction', type: 'homework', subjectId: s3, dueDate: tomorrow, priority: 'high', completed: false, order: 1, createdAt: now, updatedAt: now },
      { id: uid(), title: 'Set up dev environment', type: 'project', subjectId: s1, priority: 'low', completed: true, order: 2, createdAt: now, updatedAt: now },
    ],
    notes: [
      { id: uid(), title: 'Pointers in C++', content: '<h2>Pointers</h2><p>A pointer stores a <b>memory address</b>.</p><ul><li>Use <code>*</code> to dereference</li><li>Use <code>&amp;</code> to get an address</li></ul>', subjectId: s1, tags: ['cpp', 'memory'], pinned: true, archived: false, createdAt: now, updatedAt: now },
      { id: uid(), title: 'Essay ideas', content: '<p>Brainstorm for the argumentative essay.</p><ul data-checklist="true"><li data-checked="false">Pick a topic</li><li data-checked="false">Find 3 sources</li></ul>', subjectId: s3, tags: ['writing'], pinned: false, archived: false, createdAt: now, updatedAt: now },
    ],
    sessions: [],
  }
}
