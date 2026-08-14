-- Patient feedback is tied to a completed appointment and is safe to show publicly.
CREATE TABLE public.patient_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid NOT NULL UNIQUE REFERENCES public.appointments(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  doctor_id uuid NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text NOT NULL CHECK (char_length(trim(comment)) BETWEEN 10 AND 1000),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.patient_reviews TO anon, authenticated;
GRANT INSERT ON public.patient_reviews TO authenticated;
GRANT ALL ON public.patient_reviews TO service_role;
ALTER TABLE public.patient_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "patient_reviews_public_read" ON public.patient_reviews
  FOR SELECT USING (true);
CREATE POLICY "patient_reviews_patient_insert" ON public.patient_reviews
  FOR INSERT TO authenticated
  WITH CHECK (
    patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid())
    AND EXISTS (
      SELECT 1 FROM public.appointments a
      WHERE a.id = patient_reviews.appointment_id
        AND a.patient_id = patient_reviews.patient_id
        AND a.doctor_id = patient_reviews.doctor_id
        AND a.status = 'COMPLETED'
    )
  );

-- Replace the original placeholder records with Nigerian doctors in existing environments.
UPDATE public.doctors SET name = 'Dr. Amaka Nwosu', email = 'amaka.nwosu@care-reach.ng'
  WHERE email = 'doctor1@clinic.com';
UPDATE public.doctors SET name = 'Dr. Tunde Adeyemi', email = 'tunde.adeyemi@care-reach.ng'
  WHERE email = 'doctor2@clinic.com';
UPDATE public.doctors SET name = 'Dr. Nadia Okafor', email = 'nadia.okafor@care-reach.ng'
  WHERE email = 'doctor3@clinic.com';
UPDATE public.doctors SET name = 'Dr. Chinedu Eze', email = 'chinedu.eze@care-reach.ng'
  WHERE email = 'doctor4@clinic.com';
UPDATE public.doctors SET name = 'Dr. Aisha Bello', email = 'aisha.bello@care-reach.ng'
  WHERE email = 'doctor5@clinic.com';
