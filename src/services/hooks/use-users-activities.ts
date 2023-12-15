import { useQuery } from "@tanstack/react-query";
import { getActivitiesByUserId } from "../users";

export function useUsersActivities(userId: string) {
  return useQuery({
    queryKey: [`activities/group/${userId}`, userId],
    queryFn: async () => getActivitiesByUserId(userId)
  })
}