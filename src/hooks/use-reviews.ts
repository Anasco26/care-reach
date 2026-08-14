import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as store from "@/lib/data-store";

export function useReviews(patientId?: string) {
  return useQuery({
    queryKey: ["reviews", patientId ?? "public"],
    queryFn: () => store.listReviews(patientId),
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: store.createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}
