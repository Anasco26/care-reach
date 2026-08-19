import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as store from "@/lib/data-store";
import type { Patient } from "@/types";

export function usePatients() {
  return useQuery({
    queryKey: ["patients"],
    queryFn: () => store.listPatients(),
  });
}

export function usePatient(id: string) {
  return useQuery({
    queryKey: ["patients", id],
    queryFn: () => store.getPatient(id),
    enabled: Boolean(id),
  });
}

export function usePatientByUserId(userId: string) {
  return useQuery({
    queryKey: ["patients", "by-user", userId],
    queryFn: () => store.getPatientByUserId(userId),
    enabled: Boolean(userId),
  });
}

export function useUpdatePatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: string; input: Partial<Patient> }) =>
      store.updatePatient(vars.id, vars.input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["patients"] });
      qc.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}
