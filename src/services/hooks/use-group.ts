import { useQuery } from "@tanstack/react-query";
import { getGroupById } from "../groups";

export function useGroup(id: string) {
  return useQuery({
    queryKey: [`group/${id}`, id],
    queryFn: async () => getGroupById(id)
  })
}