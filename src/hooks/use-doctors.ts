import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as store from "@/lib/data-store";
import { createDoctorAccount } from "@/lib/doctor-account.functions";
import type { DoctorInput } from "@/lib/data-store";


export function useDoctors() {
  return useQuery({
    queryKey: ["doctors"],
    queryFn: () => store.listDoctors(),
  });
}

export function useDoctor(id: string) {
  return useQuery({
    queryKey: ["doctors", id],
    queryFn: () => store.getDoctor(id),
    enabled: Boolean(id),
  });
}

export function useSpecializations() {
  return useQuery({
    queryKey: ["specializations"],
    queryFn: () => store.getSpecializations(),
  });
}

function useInvalidate() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ["doctors"] });
    qc.invalidateQueries({ queryKey: ["appointments"] });
    qc.invalidateQueries({ queryKey: ["stats"] });
  };
}

export function useCreateDoctor() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (input: DoctorInput) =>
      createDoctorAccount({
        name: input.name,
        email: input.email,
        phone: input.phone ?? "",
        specializationId: input.specializationId,
        experienceYears: Number(input.experienceYears),
        fee: Number(input.fee),
        gender: input.gender,
        available: input.available,
        bio: input.bio ?? "",
      }),
    onSuccess: invalidate,
  });
}


export function useUpdateDoctor() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (vars: { id: string; input: Partial<DoctorInput> }) =>
      store.updateDoctor(vars.id, vars.input),
    onSuccess: invalidate,
  });
}

export function useDeleteDoctor() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (id: string) => store.deleteDoctor(id),
    onSuccess: invalidate,
  });
}
