'use client'

import { Bell } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { useInvitations } from '@/services/hooks/use-invitations'
import { useAuth } from '@/context/auth-context'
import { acceptInvitation } from '@/services/invitations'
import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@/lib/react-query'

type Notification = {
  sender: string
  receiver: string
  title: string
  message: string
  groupId: string
}

export function NotificationDropdown() {
  const router = useRouter()
  const { user } = useAuth()

  const invitationsQuery = useInvitations(String(user?.email))

  const acceptInvite = useMutation({
    mutationFn: acceptInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`invitations/${user?.email}`],
      })
      queryClient.invalidateQueries({
        queryKey: [`groups/user/${user?.email}`],
      })
    },
  })

  if (!invitationsQuery.data) {
    return <span>Carregando...</span>
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5" />
          <span className="rounded-full w-5 h-5 text-sm grid place-items-center absolute text-background bg-yellow-300 -top-2 right-0">
            {invitationsQuery.data?.length}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Notificações</h4>
            <p className="text-sm text-muted-foreground">
              Visualize todas as suas notificações.
            </p>
          </div>

          <div className="space-y-4">
            {invitationsQuery.data.length === 0 && (
              <span className="text-sm">Nenhuma notificação</span>
            )}

            {invitationsQuery.data.map((item) => (
              <div
                key={item.id}
                className="space-y-4 border border-border p-3 rounded"
              >
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {item.message}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => console.log('refuse')}
                  >
                    Recusar
                  </Button>
                  <Button
                    onClick={async () =>
                      await acceptInvite.mutateAsync({
                        invitationId: item.id,
                        groupId: item.groupId,
                        userEmail: item.receiverEmail,
                      })
                    }
                    size="sm"
                  >
                    Aceitar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
