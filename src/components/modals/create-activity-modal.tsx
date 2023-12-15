'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useModalStore } from '@/hooks/use-modal-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
// import format from 'date-fns/fp/formatWithOptions'
import { ptBR } from 'date-fns/locale'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/context/auth-context'
import toast from 'react-hot-toast'
import { useParams, useRouter } from 'next/navigation'
import { useTypes } from '@/services/hooks/use-types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@/lib/react-query'
import { Calendar } from '../ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { CalendarIcon } from 'lucide-react'
// import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

const formSchema = z.object({
  name: z.string().min(1, { message: 'Nome obrigatório' }),
  activityType: z.string().min(1, { message: 'Tipo obrigatório' }),
  description: z.string(),
  activityDate: z.date({
    required_error: 'Data obrigatória.',
  }),
})

export function CreateActivityModal() {
  const isOpen = useModalStore((state) => state.isOpen)
  const type = useModalStore((state) => state.type)
  const onClose = useModalStore((state) => state.onClose)
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()

  const typesQuery = useTypes(String(params.groupId))

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      activityType: '',
    },
  })

  const isModalOpen = isOpen && type === 'createActivity'

  function handleClose() {
    onClose()
    form.reset()
  }

  const createActivity = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const groupRef = collection(db, `groups/${params.groupId}/activities`)

      await addDoc(groupRef, {
        name: values.name,
        description: values.description,
        activityType: values.activityType,
        userEmail: user?.email,
        activityDate: values.activityDate,
        createdAt: new Date(),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`activities/group/${params.groupId}`],
      })
    },
  })

  const createUserActivity = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const userRef = collection(db, `users/${user?.id}/activities`)

      await addDoc(userRef, {
        name: values.name,
        description: values.description,
        activityType: values.activityType,
        userEmail: user?.email,
        activityDate: values.activityDate,
        createdAt: new Date(),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`activities/${user?.id}`],
      })
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createActivity.mutateAsync(values)
      await createUserActivity.mutateAsync(values)

      handleClose()
      toast.success(`Grupo ${values.name} criado com sucesso`)
      router.refresh()
    } catch (error) {
      console.log(error)
      toast.error('Ocorreu um erro na criação da atividade')
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crie uma atividade</DialogTitle>
          <DialogDescription>
            Preencha os campos e crie sua atividade!
          </DialogDescription>
        </DialogHeader>
        {/* <Input placeholder="Academia" type="time" /> */}
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
                    <FormLabel>Nome da atividade</FormLabel>
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
                    <FormLabel>Descrição da atividade</FormLabel>
                    <FormControl>
                      <Input placeholder="Rotina de academia..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="activityType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="gap-4">
                          <SelectValue placeholder="Selecione um tipo para essa atividade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {typesQuery.data?.map((item) => (
                          <SelectItem key={item.id} value={item.name}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="activityDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date da atividade</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-wfull pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP', { locale: ptBR })
                            ) : (
                              <span>Selecione a data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
