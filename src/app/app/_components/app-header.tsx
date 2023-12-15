'use client'

import { Button } from '@/components/ui/button'
import { useModalStore } from '@/hooks/use-modal-store'

export function AppHeader() {
  const onOpen = useModalStore((state) => state.onOpen)

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-semibold tracking-tight">Início</h1>
      <Button onClick={() => onOpen('createGroup')} size="sm">
        Criar grupo
      </Button>
    </div>
  )
}
