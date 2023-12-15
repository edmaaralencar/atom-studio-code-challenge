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
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { addDoc, collection, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import toast from 'react-hot-toast'
import { useParams, useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@/lib/react-query'

const formSchema = z.object({
  name: z.string().min(1, { message: 'Nome obrigatório' }),
})

export function CreateTypeModal() {
  const isOpen = useModalStore((state) => state.isOpen)
  const type = useModalStore((state) => state.type)
  const onClose = useModalStore((state) => state.onClose)
  const router = useRouter()
  const params = useParams()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  })

  const isModalOpen = isOpen && type === 'createType'

  function handleClose() {
    onClose()
    form.reset()
  }

  const createType = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const groupRef = collection(db, `groups/${params.groupId}/types`)

      await addDoc(groupRef, {
        name: values.name,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`types/group/${params.groupId}`],
      })
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createType.mutateAsync(values)

      onClose()
      toast.success(`Tipo ${values.name} criado com sucesso`)
      router.refresh()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crie um tipo</DialogTitle>
          <DialogDescription>
            Os tipos serão utilizados para categorizar suas atividades diárias
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
                    <FormLabel>Nome do tipo</FormLabel>
                    <FormControl>
                      <Input placeholder="Front-end" {...field} />
                    </FormControl>
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
