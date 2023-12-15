import { useQuery } from "@tanstack/react-query";
import { getActivitiesByGroupId } from "../groups";

export function useActivities(groupId: string) {
  return useQuery({
    queryKey: [`activities/group/${groupId}`, groupId],
    queryFn: async () => getActivitiesByGroupId(groupId)
  })
}