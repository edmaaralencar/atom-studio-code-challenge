import { useQuery } from "@tanstack/react-query";
import { getGroupsByUserEmail } from "../groups";

export function useGroups(userEmail: string) {
  return useQuery({
    queryKey: [`groups/${userEmail}`, userEmail],
    queryFn: async () => getGroupsByUserEmail(userEmail)
  })
}