
CREATE TYPE public.app_role AS ENUM ('ADMIN','DOCTOR','PATIENT');
CREATE TYPE public.gender_type AS ENUM ('MALE','FEMALE','OTHER');
CREATE TYPE public.appointment_status AS ENUM ('PENDING','APPROVED','COMPLETED','CANCELLED');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(), 'ADMIN'));
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(), 'ADMIN'));

CREATE POLICY "user_roles_select_own" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'ADMIN'));

CREATE TABLE public.specializations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT ''
);
GRANT SELECT ON public.specializations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.specializations TO authenticated;
GRANT ALL ON public.specializations TO service_role;
ALTER TABLE public.specializations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "specializations_public_read" ON public.specializations FOR SELECT USING (true);
CREATE POLICY "specializations_admin_write" ON public.specializations FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'ADMIN')) WITH CHECK (public.has_role(auth.uid(), 'ADMIN'));

CREATE TABLE public.doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  specialization_id uuid REFERENCES public.specializations(id) ON DELETE SET NULL,
  experience_years integer NOT NULL DEFAULT 0,
  fee numeric NOT NULL DEFAULT 0,
  bio text NOT NULL DEFAULT '',
  available boolean NOT NULL DEFAULT true,
  gender public.gender_type NOT NULL DEFAULT 'OTHER',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.doctors TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.doctors TO authenticated;
GRANT ALL ON public.doctors TO service_role;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "doctors_public_read" ON public.doctors FOR SELECT USING (true);
CREATE POLICY "doctors_admin_insert" ON public.doctors FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'ADMIN'));
CREATE POLICY "doctors_update" ON public.doctors FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'ADMIN') OR user_id = auth.uid())
  WITH CHECK (public.has_role(auth.uid(), 'ADMIN') OR user_id = auth.uid());
CREATE POLICY "doctors_admin_delete" ON public.doctors FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'ADMIN'));

CREATE TABLE public.patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  gender public.gender_type NOT NULL DEFAULT 'OTHER',
  date_of_birth date,
  address text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.patients TO authenticated;
GRANT ALL ON public.patients TO service_role;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "patients_select" ON public.patients FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'ADMIN') OR public.has_role(auth.uid(), 'DOCTOR'));
CREATE POLICY "patients_insert_own" ON public.patients FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "patients_update" ON public.patients FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'ADMIN'))
  WITH CHECK (user_id = auth.uid() OR public.has_role(auth.uid(), 'ADMIN'));
CREATE POLICY "patients_admin_delete" ON public.patients FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'ADMIN'));

CREATE TABLE public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  date date NOT NULL,
  time text NOT NULL,
  reason text NOT NULL DEFAULT '',
  status public.appointment_status NOT NULL DEFAULT 'PENDING',
  cancel_reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX appointments_slot_unique ON public.appointments (doctor_id, date, time)
  WHERE status <> 'CANCELLED';
GRANT SELECT, INSERT, UPDATE, DELETE ON public.appointments TO authenticated;
GRANT ALL ON public.appointments TO service_role;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.owns_patient(_patient_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.patients p WHERE p.id = _patient_id AND p.user_id = auth.uid())
$$;

CREATE OR REPLACE FUNCTION public.owns_doctor(_doctor_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.doctors d WHERE d.id = _doctor_id AND d.user_id = auth.uid())
$$;

CREATE POLICY "appointments_select" ON public.appointments FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'ADMIN') OR public.owns_patient(patient_id) OR public.owns_doctor(doctor_id));
CREATE POLICY "appointments_insert" ON public.appointments FOR INSERT TO authenticated
  WITH CHECK (public.owns_patient(patient_id) OR public.has_role(auth.uid(), 'ADMIN'));
CREATE POLICY "appointments_update" ON public.appointments FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'ADMIN') OR public.owns_patient(patient_id) OR public.owns_doctor(doctor_id))
  WITH CHECK (public.has_role(auth.uid(), 'ADMIN') OR public.owns_patient(patient_id) OR public.owns_doctor(doctor_id));
CREATE POLICY "appointments_delete" ON public.appointments FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'ADMIN'));

INSERT INTO public.specializations (name, description) VALUES
  ('Cardiology','Heart and cardiovascular system care'),
  ('Dermatology','Skin, hair and nail conditions'),
  ('Pediatrics','Medical care for infants, children and adolescents'),
  ('Orthopedics','Bones, joints, ligaments and muscles'),
  ('Neurology','Brain, spinal cord and nervous system');

INSERT INTO public.doctors (name, email, phone, specialization_id, experience_years, fee, bio, available, gender)
SELECT 'Dr. Amelia Hart','doctor1@clinic.com','+234 801 000 0001', s.id, 12, 25000, 'Board-certified cardiologist focused on preventive heart care and arrhythmia management.', true, 'FEMALE' FROM public.specializations s WHERE s.name='Cardiology';
INSERT INTO public.doctors (name, email, phone, specialization_id, experience_years, fee, bio, available, gender)
SELECT 'Dr. Julian Reyes','doctor2@clinic.com','+234 801 000 0002', s.id, 8, 15000, 'Dermatologist specialising in medical and cosmetic skin treatments.', true, 'MALE' FROM public.specializations s WHERE s.name='Dermatology';
INSERT INTO public.doctors (name, email, phone, specialization_id, experience_years, fee, bio, available, gender)
SELECT 'Dr. Nadia Okafor','doctor3@clinic.com','+234 801 000 0003', s.id, 15, 18000, 'Paediatrician with a gentle approach to childhood development and vaccination care.', true, 'FEMALE' FROM public.specializations s WHERE s.name='Pediatrics';
INSERT INTO public.doctors (name, email, phone, specialization_id, experience_years, fee, bio, available, gender)
SELECT 'Dr. Marcus Feld','doctor4@clinic.com','+234 801 000 0004', s.id, 10, 30000, 'Orthopedic surgeon treating sports injuries and joint replacement.', true, 'MALE' FROM public.specializations s WHERE s.name='Orthopedics';
INSERT INTO public.doctors (name, email, phone, specialization_id, experience_years, fee, bio, available, gender)
SELECT 'Dr. Priya Anand','doctor5@clinic.com','+234 801 000 0005', s.id, 6, 28000, 'Neurologist with expertise in migraine, epilepsy and movement disorders.', true, 'FEMALE' FROM public.specializations s WHERE s.name='Neurology';
