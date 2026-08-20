-- Fix appointments insert RLS policy.
-- The previous policy required has_role(auth.uid(), 'PATIENT'), which fails
-- for accounts that were registered before the user_roles provisioning flow
-- was added (e.g. email-confirmation signups that never called provision).
-- Owning the patient record itself is the authoritative check that the caller
-- is a patient, so we drop the user_roles dependency and restore the original,
-- more robust rule.
DROP POLICY IF EXISTS appointments_insert ON public.appointments;

CREATE POLICY appointments_insert ON public.appointments
FOR INSERT TO authenticated
WITH CHECK (
  public.owns_patient(patient_id) OR public.has_role(auth.uid(), 'ADMIN')
);