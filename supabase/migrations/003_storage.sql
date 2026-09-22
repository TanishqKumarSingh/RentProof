-- Insert storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('rental-documents', 'rental-documents', false),
  ('payment-receipts', 'payment-receipts', false),
  ('property-evidence', 'property-evidence', false),
  ('inspection-photos', 'inspection-photos', false),
  ('maintenance-evidence', 'maintenance-evidence', false),
  ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for 'rental-documents'
CREATE POLICY "Authenticated users can upload rental-documents"
ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'rental-documents');
CREATE POLICY "Authenticated users can view rental-documents"
ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'rental-documents');

-- Storage Policies for 'payment-receipts'
CREATE POLICY "Authenticated users can upload payment-receipts"
ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'payment-receipts');
CREATE POLICY "Authenticated users can view payment-receipts"
ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'payment-receipts');

-- Storage Policies for 'property-evidence'
CREATE POLICY "Authenticated users can upload property-evidence"
ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'property-evidence');
CREATE POLICY "Authenticated users can view property-evidence"
ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'property-evidence');

-- Storage Policies for 'inspection-photos'
CREATE POLICY "Authenticated users can upload inspection-photos"
ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'inspection-photos');
CREATE POLICY "Authenticated users can view inspection-photos"
ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'inspection-photos');

-- Storage Policies for 'maintenance-evidence'
CREATE POLICY "Authenticated users can upload maintenance-evidence"
ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'maintenance-evidence');
CREATE POLICY "Authenticated users can view maintenance-evidence"
ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'maintenance-evidence');

-- Storage Policies for 'avatars'
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars');
CREATE POLICY "Public can view avatars"
ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can update their own avatars"
ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'avatars');
CREATE POLICY "Users can delete their own avatars"
ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'avatars');
