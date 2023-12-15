import { useQuery } from '@tanstack/react-query'
import { getInvitationsByUserEmail } from '../invitations'

export function useInvitations(userEmail: string) {
  return useQuery({
    queryKey: [`invitations/${userEmail}`, userEmail],
    queryFn: () => getInvitationsByUserEmail(userEmail),
    staleTime: 1000 * 60 * 5,
  })
}
