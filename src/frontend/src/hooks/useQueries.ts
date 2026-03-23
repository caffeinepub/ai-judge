import { useMutation, useQuery } from "@tanstack/react-query";
import type { Verdict } from "../backend.d";
import { useActor } from "./useActor";

export function useAnalyzeCaseAnonymous() {
  const { actor } = useActor();
  return useMutation<
    Verdict,
    Error,
    { description: string; otherPartyDescription: string | null }
  >({
    mutationFn: async ({ description, otherPartyDescription }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.analyzeCaseAnonymous(description, otherPartyDescription);
    },
  });
}

export function useGetUserCases() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["userCases"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserCases();
    },
    enabled: !!actor && !isFetching,
  });
}
