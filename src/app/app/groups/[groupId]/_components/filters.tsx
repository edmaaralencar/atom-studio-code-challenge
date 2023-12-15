'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type FiltersProps = {
  onSelectFilter: ({
    type,
    data,
  }: {
    type: 'activityType' | 'user' | ''
    data: string
  }) => void
  participants: string[]
  activityTypes: string[]
}

export function Filters({
  participants,
  activityTypes,
  onSelectFilter,
}: FiltersProps) {
  return (
    <div className="flex items-center gap-2">
      <Select
        onValueChange={(value) =>
          onSelectFilter({
            type: value === 'Todos' ? '' : 'user',
            data: value === 'Todos' ? '' : value,
          })
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Usuário" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Todos">Todos</SelectItem>
          {participants.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        onValueChange={(value) =>
          onSelectFilter({
            type: value === 'Todos' ? '' : 'activityType',
            data: value === 'Todos' ? '' : value,
          })
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Tipos de atividade" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Todos">Todos</SelectItem>
          {activityTypes.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
