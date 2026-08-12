ALTER TABLE public.doctors
  ADD COLUMN IF NOT EXISTS available_slots text[] NOT NULL DEFAULT ARRAY['09:00','09:30','10:00','10:30','11:00','11:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30']::text[];

CREATE OR REPLACE FUNCTION public.booked_slots(_doctor_id uuid, _date date)
RETURNS TABLE(slot text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT to_char(a.time::time, 'HH24:MI')
  FROM public.appointments a
  WHERE a.doctor_id = _doctor_id
    AND a.date = _date
    AND a.status <> 'CANCELLED'
$$;

GRANT EXECUTE ON FUNCTION public.booked_slots(uuid, date) TO anon, authenticated;