import Link from 'next/link'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { useDeleteGroup } from '@/services/hooks/use-delete-group'
import { Trash2 } from 'lucide-react'

type GroupCardProps = {
  id: string
  name: string
  description: string
  participants: string[]
}

export function GroupCard({
  id,
  name,
  description,
  participants,
}: GroupCardProps) {
  const deleteGroup = useDeleteGroup()

  return (
    <div
      key={id}
      className="border-2 relative border-border p-4 flex flex-col gap-4 rounded-md"
    >
      <button
        onClick={() => deleteGroup.mutateAsync(id)}
        className="p-1 absolute top-4 right-4"
      >
        <Trash2 size={14} className="text-muted-foreground" />
      </button>
      <div className="space-y-2">
        <h2>{name}</h2>
        <p className="text-sm text-muted-foreground h-10">{description}</p>
      </div>

      <div className="space-y-2">
        <span className="text-sm">Participantes:</span>
        <div className="flex gap-2 flex-wrap">
          {participants.map((participant) => (
            <Badge
              variant="secondary"
              className="w-full justify-center py-1.5"
              key={participant}
            >
              {participant}
            </Badge>
          ))}
        </div>
      </div>

      <Button size="sm" className="mt-auto" asChild>
        <Link href={`/app/groups/${id}`}>Ver mais</Link>
      </Button>
    </div>
  )
}
