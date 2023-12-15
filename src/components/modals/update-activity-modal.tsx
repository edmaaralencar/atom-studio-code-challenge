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
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
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
import { useUpdateActivityModal } from '@/hooks/use-update-activity-modal-store'
import { useEffect } from 'react'

const formSchema = z.object({
  name: z.string().min(1, { message: 'Nome obrigatório' }),
  activityType: z.string().min(1, { message: 'Tipo obrigatório' }),
  description: z.string(),
  activityDate: z.date({
    required_error: 'Data obrigatória.',
  }),
})

export function UpdateActivityModal() {
  const isOpen = useUpdateActivityModal((state) => state.isOpen)
  const onClose = useUpdateActivityModal((state) => state.onClose)

  const name = useUpdateActivityModal((state) => state.data?.name)
  const description = useUpdateActivityModal((state) => state.data?.description)
  const type = useUpdateActivityModal((state) => state.data?.type)
  const activityId = useUpdateActivityModal((state) => state.data?.activityId)

  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()

  const typesQuery = useTypes(String(params.groupId))

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: name,
      description: description,
      activityType: type,
    },
  })

  function handleClose() {
    onClose()
    form.reset()
  }

  useEffect(() => {
    let defaultValues = {
      name,
      activityType: type,
      description,
    }
    form.reset({ ...defaultValues })
  }, [description, form, name, type])

  const updateActivity = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const activityRef = doc(
        db,
        'groups',
        String(params.groupId),
        'activities',
        String(activityId)
      )

      await updateDoc(activityRef, {
        name: values.name,
        description: values.description,
        activityType: values.activityType,
        activityDate: values.activityDate,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`activities/group/${params.groupId}`],
      })
    },
  })

  const updateUserActivity = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const activityRef = doc(
        db,
        'groups',
        String(params.groupId),
        'activities',
        String(activityId)
      )

      await updateDoc(activityRef, {
        name: values.name,
        description: values.description,
        activityType: values.activityType,
        activityDate: values.activityDate,
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
      await updateActivity.mutateAsync(values)
      await updateUserActivity.mutateAsync(values)

      handleClose()
      toast.success(`Grupo ${values.name} atualizado com sucesso`)
      router.refresh()
    } catch (error) {
      console.log(error)
      toast.error('Ocorreu um erro na criação da atividade')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Atualize a atividade {name}!</DialogTitle>
          <DialogDescription>
            Preencha os campos e atualize sua atividade
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
