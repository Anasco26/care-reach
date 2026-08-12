DROP POLICY IF EXISTS appointments_insert ON public.appointments;
CREATE POLICY appointments_insert ON public.appointments
FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'PATIENT') AND public.owns_patient(patient_id));