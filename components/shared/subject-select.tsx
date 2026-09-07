'use client'

import { Select } from '@/components/ui/select'
import { useStore } from '@/lib/store'

export function SubjectSelect({
  value,
  onChange,
  allowNone = true,
  id,
}: {
  value: string | undefined
  onChange: (v: string | undefined) => void
  allowNone?: boolean
  id?: string
}) {
  const { data } = useStore()
  return (
    <Select
      id={id}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value || undefined)}
    >
      {allowNone && <option value="">No subject</option>}
      {data.subjects.map((s) => (
        <option key={s.id} value={s.id}>
          {s.name}
        </option>
      ))}
    </Select>
  )
}
