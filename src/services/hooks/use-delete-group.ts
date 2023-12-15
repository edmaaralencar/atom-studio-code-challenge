import { useAuth } from '@/context/auth-context'
import { db } from '@/lib/firebase'
import { queryClient } from '@/lib/react-query'
import { useMutation } from '@tanstack/react-query'
import { deleteDoc, doc } from 'firebase/firestore'
import toast from 'react-hot-toast'

export function useDeleteGroup() {
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (groupId: string) => {
      const activityRef = doc(db, 'groups', groupId)

      await deleteDoc(activityRef)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`groups/${user?.email}`],
      })
      toast.success('Grupo deletado com sucesso')
    },
  })
}
