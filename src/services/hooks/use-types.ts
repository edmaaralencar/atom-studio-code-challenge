import { useQuery } from "@tanstack/react-query";
import { getTypesByGroupId } from "../groups";

export function useTypes(groupId: string) {
  return useQuery({
    queryKey: [`types/group/${groupId}`, groupId],
    queryFn: async () => getTypesByGroupId(groupId)
  })
}