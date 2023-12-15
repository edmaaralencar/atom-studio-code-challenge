'use client'

import { z } from 'zod'
import {
  FormLabel,
} from './ui/form'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Plus } from 'lucide-react'
import { useState } from 'react'

type AddParticipantFormProps = {
  onAdd: (hour: z.infer<typeof formSchema>) => void
}

const formSchema = z.object({
  email: z.string().min(1, { message: 'E-mail obrigatório' }),
})

export function AddParticipantForm({ onAdd }: AddParticipantFormProps) {
  const [participantEmail, setParticipantEmail] = useState('')

  function onSubmit(email: string) {
    onAdd({ email })
    setParticipantEmail('')
  }

  return (
    <div className="grid grid-cols-[1fr_auto] items-end gap-2">
      <div className="space-y-2">
        <FormLabel>E-mail</FormLabel>
        <Input
          value={participantEmail}
          onChange={(event) => setParticipantEmail(event.target.value)}
          className="flex-1"
          placeholder="teste@gmail.com"
        />
      </div>

      <Button onClick={() => onSubmit(participantEmail)} type="button">
        <Plus size={24} />
      </Button>
    </div>
  )
}
