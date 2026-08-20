import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as store from "@/lib/data-store";
import type { AppointmentStatus } from "@/types";
import { useAuth } from "@/contexts/auth-context";

export function useAppointments(filter?: {
  doctorId?: string;
  patientId?: string;
}) {
  return useQuery({
    queryKey: ["appointments", filter ?? "all"],
    queryFn: async () => {
      if (filter?.doctorId !== undefined)
        return store.listAppointmentsByDoctor(filter.doctorId);
      if (filter?.patientId !== undefined)
        return store.listAppointmentsByPatient(filter.patientId);
      return store.listAppointments();
    },
  });
}

export function useBookedSlots(doctorId: string, date: string) {
  return useQuery({
    queryKey: ["booked-slots", doctorId, date],
    queryFn: () => store.getBookedSlots(doctorId, date),
    enabled: Boolean(doctorId && date),
  });
}

export function useStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: () => store.getDashboardData(),
  });
}

function useInvalidate() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ["appointments"] });
    qc.invalidateQueries({ queryKey: ["booked-slots"] });
    qc.invalidateQueries({ queryKey: ["stats"] });
  };
}

export function useCreateAppointment() {
  const { user } = useAuth();
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (input: store.BookingInput) => store.createAppointment(input, user?.id),
    onSuccess: invalidate,
  });
}

export function useUpdateAppointmentStatus() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (vars: {
      id: string;
      status: AppointmentStatus;
      cancelReason?: string;
    }) => store.updateAppointmentStatus(vars.id, vars.status, vars.cancelReason),
    onSuccess: invalidate,
  });
}
