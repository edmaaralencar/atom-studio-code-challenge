import { db } from '@/lib/firebase'
import { queryClient } from '@/lib/react-query'
import { useMutation } from '@tanstack/react-query'
import { deleteDoc, doc } from 'firebase/firestore'
import { useParams } from 'next/navigation'
import toast from 'react-hot-toast'

export function useDeleteActivity() {
  const params = useParams()

  return useMutation({
    mutationFn: async (activityId: string) => {
      const activityRef = doc(
        db,
        'groups',
        String(params.groupId),
        'activities',
        activityId
      )

      await deleteDoc(activityRef)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`activities/group/${params.groupId}`],
      })
      toast.success('Atividade deletada com sucesso')
    },
  })
}
