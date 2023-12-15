'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useModalStore } from '@/hooks/use-modal-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { AddParticipantForm } from '../add-participant-form'
import { Trash } from 'lucide-react'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/context/auth-context'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { sendInvite } from '@/services/invitations'
import { isUserRegistered } from '@/services/users'

const formSchema = z.object({
  name: z.string().min(1, { message: 'Nome obrigatório' }),
  description: z.string().min(1, { message: 'Descrição obrigatória' }),
  participants: z.array(
    z.object({
      email: z.string(),
    })
  ),
})

export function CreateGroupModal() {
  const isOpen = useModalStore((state) => state.isOpen)
  const type = useModalStore((state) => state.type)
  const onClose = useModalStore((state) => state.onClose)
  const { user } = useAuth()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      participants: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'participants',
  })

  const isModalOpen = isOpen && type === 'createGroup'

  function handleClose() {
    onClose()
    form.reset()
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formattedParticipants = values.participants.map((item) => item.email)

    try {
      const group = await addDoc(collection(db, 'groups'), {
        name: values.name,
        description: values.description,
        owner: user?.email,
        participants: [user?.email],
      })
      const invitations = formattedParticipants.map((participant) => {
        return sendInvite({
          receiverEmail: participant,
          senderEmail: String(user?.email),
          groupId: group.id,
          message: `Você recebeu um convite para entrar no grupo de ${user?.email} sobre ${values.name}`,
          title: 'Novo convite!',
        })
      })

      await Promise.all(invitations)

      for (const participant of formattedParticipants) {
        const isUserInApp = await isUserRegistered(participant)

        if (!isUserInApp) {
          const emailInvitations = formattedParticipants.map((participant) => {
            return axios.post('/api/invitation', {
              invitedByEmail: String(user?.email),
              invitedEmail: participant,
              groupName: values.name,
            })
          })

          await Promise.all(emailInvitations)
        }
      }

      onClose()
      toast.success(`Grupo ${values.name} criado com sucesso`)
      router.refresh()
    } catch (error) {
      console.log(error)
      console.log(JSON.stringify(error))
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crie seu grupo</DialogTitle>
          <DialogDescription>
            Preencha os campos e convide seus amigos para criar o seu grupo
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-5"
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do grupo</FormLabel>
                    <FormControl>
                      <Input placeholder="Academia" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição do grupo</FormLabel>
                    <FormControl>
                      <Input placeholder="Rotina de academia..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <AddParticipantForm onAdd={append} />
              <FormDescription>
                Os usuários que já estão na aplicação receberão uma notificação
                e quem não está receberá um email de convite.
              </FormDescription>
            </div>

            {fields.length > 0 && (
              <div className="space-y-2">
                <span>Lista de participantes</span>
                <div className="grid grid-cols-2 gap-2">
                  {fields.map((item, index) => (
                    <div
                      className="border border-border text-muted-foreground p-2 py-3 rounded-md text-sm flex justify-between items-center"
                      key={item.id}
                    >
                      {item.email}
                      <Trash
                        className="cursor-pointer"
                        onClick={() => remove(index)}
                        size={18}
                        color="#64748b"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <Button
              isLoading={form.formState.isSubmitting}
              disabled={form.formState.isSubmitting}
              className="w-full"
              type="submit"
            >
              Salvar
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
