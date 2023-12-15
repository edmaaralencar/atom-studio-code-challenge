'use client'

import { GroupCard } from '@/components/group-card'
import { Spinner } from '@/components/spinner'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/auth-context'
import { useModalStore } from '@/hooks/use-modal-store'
import { useGroups } from '@/services/hooks/use-groups'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

export default function Groups() {
  const onOpen = useModalStore((state) => state.onOpen)
  const searchParams = useSearchParams()

  const { user } = useAuth()
  const groupsQuery = useGroups(String(user?.email))

  const filteredGroups = useMemo(() => {
    if (!groupsQuery.data) {
      return []
    }

    const query = searchParams.get('q')

    if (query) {
      return groupsQuery.data.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      )
    }

    return groupsQuery.data
  }, [groupsQuery.data, searchParams])

  if (!groupsQuery.data) {
    return (
      <div className="w-full h-full grid place-items-center">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">Seus grupos</h1>

        <Button onClick={() => onOpen('createGroup')} size="sm">
          Criar grupo
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {filteredGroups.map((group) => (
          <GroupCard
            key={group.id}
            id={group.id}
            name={group.name}
            description={group.description}
            participants={group.participants}
          />
        ))}
      </div>
    </div>
  )
}
