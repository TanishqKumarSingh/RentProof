-- NOTE: Before running this seed script, please make sure you have created the following users in the Supabase Auth dashboard:
-- 1. Email: tenant@rentproof.demo, Password: password123, UUID: d9ac69ab-1995-456c-b845-cb7714022f5f (or manually map id after creation)
-- 2. Email: landlord@rentproof.demo, Password: password123, UUID: 3159157d-5336-498b-b5ab-164149b9b688 (or manually map id after creation)
-- Since auth.users is managed by Supabase Auth, we directly insert into public.profiles for seed data assuming they exist or we bypass FK momentarily for demo.
-- For local development, auth.users inserts can work if schema allows. Here we insert directly into profiles assuming the FK exists and we provide the UUIDs. 
-- In a real reset, you might need to insert into auth.users as well if you are managing the local Postgres directly.

-- Insert into auth.users if local testing (commented out for production seeds where auth API should be used)
/*
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
VALUES 
  ('d9ac69ab-1995-456c-b845-cb7714022f5f', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'tenant@rentproof.demo', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('3159157d-5336-498b-b5ab-164149b9b688', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'landlord@rentproof.demo', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '');
*/

-- Profiles
INSERT INTO profiles (id, full_name, email, phone, role) VALUES 
('d9ac69ab-1995-456c-b845-cb7714022f5f', 'Aarav Sharma', 'tenant@rentproof.demo', '+919876543210', 'tenant'),
('3159157d-5336-498b-b5ab-164149b9b688', 'Rahul Mehta', 'landlord@rentproof.demo', '+919876543211', 'landlord')
ON CONFLICT (id) DO NOTHING;

-- Property
INSERT INTO properties (id, landlord_id, name, address, city, state, pincode, property_type, bedrooms, bathrooms, area_sqft, monthly_rent, deposit_amount, amenities) VALUES 
('33333333-3333-3333-3333-333333333333', '3159157d-5336-498b-b5ab-164149b9b688', 'Sunrise Residency', 'Flat B-402, Sector 10', 'Indirapuram, Ghaziabad', 'UP', '201014', 'apartment', 2, 2, 1050, 18000.00, 36000.00, ARRAY['parking', 'gym', 'pool', 'security'])
ON CONFLICT (id) DO NOTHING;

-- Rental Agreement
INSERT INTO rental_agreements (id, property_id, tenant_id, landlord_id, start_date, end_date, rent_amount, deposit_amount, payment_due_day, status, terms) VALUES 
('44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', 'd9ac69ab-1995-456c-b845-cb7714022f5f', '3159157d-5336-498b-b5ab-164149b9b688', '2025-10-01', '2026-09-30', 18000.00, 36000.00, 1, 'active', 'Standard 11 month rental agreement converted to 12 months for demo. 1 month notice period.')
ON CONFLICT (id) DO NOTHING;

-- Payments
-- Oct 2025 to Jul 2026 verified (10 months)
INSERT INTO payments (agreement_id, tenant_id, amount, due_date, paid_date, status, payment_method, transaction_ref, verified_at, verified_by) VALUES 
('44444444-4444-4444-4444-444444444444', 'd9ac69ab-1995-456c-b845-cb7714022f5f', 18000.00, '2025-10-01', '2025-10-01', 'verified', 'UPI', 'TXN1001', '2025-10-02', '3159157d-5336-498b-b5ab-164149b9b688'),
('44444444-4444-4444-4444-444444444444', 'd9ac69ab-1995-456c-b845-cb7714022f5f', 18000.00, '2025-11-01', '2025-11-02', 'verified', 'UPI', 'TXN1002', '2025-11-03', '3159157d-5336-498b-b5ab-164149b9b688'),
('44444444-4444-4444-4444-444444444444', 'd9ac69ab-1995-456c-b845-cb7714022f5f', 18000.00, '2025-12-01', '2025-12-01', 'verified', 'UPI', 'TXN1003', '2025-12-02', '3159157d-5336-498b-b5ab-164149b9b688'),
('44444444-4444-4444-4444-444444444444', 'd9ac69ab-1995-456c-b845-cb7714022f5f', 18000.00, '2026-01-01', '2026-01-03', 'verified', 'UPI', 'TXN1004', '2026-01-04', '3159157d-5336-498b-b5ab-164149b9b688'),
('44444444-4444-4444-4444-444444444444', 'd9ac69ab-1995-456c-b845-cb7714022f5f', 18000.00, '2026-02-01', '2026-02-01', 'verified', 'UPI', 'TXN1005', '2026-02-02', '3159157d-5336-498b-b5ab-164149b9b688'),
('44444444-4444-4444-4444-444444444444', 'd9ac69ab-1995-456c-b845-cb7714022f5f', 18000.00, '2026-03-01', '2026-03-02', 'verified', 'Bank Transfer', 'TXN1006', '2026-03-03', '3159157d-5336-498b-b5ab-164149b9b688'),
('44444444-4444-4444-4444-444444444444', 'd9ac69ab-1995-456c-b845-cb7714022f5f', 18000.00, '2026-04-01', '2026-04-01', 'verified', 'UPI', 'TXN1007', '2026-04-02', '3159157d-5336-498b-b5ab-164149b9b688'),
('44444444-4444-4444-4444-444444444444', 'd9ac69ab-1995-456c-b845-cb7714022f5f', 18000.00, '2026-05-01', '2026-05-01', 'verified', 'UPI', 'TXN1008', '2026-05-02', '3159157d-5336-498b-b5ab-164149b9b688'),
('44444444-4444-4444-4444-444444444444', 'd9ac69ab-1995-456c-b845-cb7714022f5f', 18000.00, '2026-06-01', '2026-06-02', 'verified', 'UPI', 'TXN1009', '2026-06-03', '3159157d-5336-498b-b5ab-164149b9b688'),
('44444444-4444-4444-4444-444444444444', 'd9ac69ab-1995-456c-b845-cb7714022f5f', 18000.00, '2026-07-01', '2026-07-01', 'verified', 'UPI', 'TXN1010', '2026-07-02', '3159157d-5336-498b-b5ab-164149b9b688');

-- Aug 2026: paid (1 month)
INSERT INTO payments (agreement_id, tenant_id, amount, due_date, paid_date, status, payment_method, transaction_ref) VALUES 
('44444444-4444-4444-4444-444444444444', 'd9ac69ab-1995-456c-b845-cb7714022f5f', 18000.00, '2026-08-01', '2026-08-02', 'paid', 'UPI', 'TXN1011');

-- Sep 2026: pending (current month)
INSERT INTO payments (agreement_id, tenant_id, amount, due_date, status) VALUES 
('44444444-4444-4444-4444-444444444444', 'd9ac69ab-1995-456c-b845-cb7714022f5f', 18000.00, '2026-09-01', 'pending');

-- Rental Events
INSERT INTO rental_events (agreement_id, event_type, title, description, created_by) VALUES 
('44444444-4444-4444-4444-444444444444', 'agreement', 'Agreement Signed', 'Digital rental agreement signed by both parties.', '3159157d-5336-498b-b5ab-164149b9b688'),
('44444444-4444-4444-4444-444444444444', 'payment', 'Security Deposit Paid', '₹36,000 paid as security deposit via Bank Transfer.', 'd9ac69ab-1995-456c-b845-cb7714022f5f'),
('44444444-4444-4444-4444-444444444444', 'inspection', 'Move-in Inspection', 'Initial property inspection completed.', '3159157d-5336-498b-b5ab-164149b9b688'),
('44444444-4444-4444-4444-444444444444', 'document', 'Identity Documents Uploaded', 'Tenant uploaded Aadhar and PAN cards.', 'd9ac69ab-1995-456c-b845-cb7714022f5f'),
('44444444-4444-4444-4444-444444444444', 'payment', 'Rent Payment - Oct 2025', 'Rent of ₹18,000 paid and verified.', '3159157d-5336-498b-b5ab-164149b9b688'),
('44444444-4444-4444-4444-444444444444', 'payment', 'Rent Payment - Nov 2025', 'Rent of ₹18,000 paid and verified.', '3159157d-5336-498b-b5ab-164149b9b688'),
('44444444-4444-4444-4444-444444444444', 'payment', 'Rent Payment - Dec 2025', 'Rent of ₹18,000 paid and verified.', '3159157d-5336-498b-b5ab-164149b9b688'),
('44444444-4444-4444-4444-444444444444', 'maintenance', 'Leaking Tap in Kitchen', 'Tenant reported a leaking tap.', 'd9ac69ab-1995-456c-b845-cb7714022f5f'),
('44444444-4444-4444-4444-444444444444', 'maintenance', 'Leaking Tap Fixed', 'Plumber fixed the tap issue.', '3159157d-5336-498b-b5ab-164149b9b688'),
('44444444-4444-4444-4444-444444444444', 'payment', 'Rent Payment - Jan 2026', 'Rent of ₹18,000 paid and verified.', '3159157d-5336-498b-b5ab-164149b9b688'),
('44444444-4444-4444-4444-444444444444', 'payment', 'Rent Payment - Feb 2026', 'Rent of ₹18,000 paid and verified.', '3159157d-5336-498b-b5ab-164149b9b688'),
('44444444-4444-4444-4444-444444444444', 'payment', 'Rent Payment - Mar 2026', 'Rent of ₹18,000 paid and verified.', '3159157d-5336-498b-b5ab-164149b9b688'),
('44444444-4444-4444-4444-444444444444', 'inspection', 'Routine Inspection - 6 Months', 'Mid-term inspection completed, no issues found.', '3159157d-5336-498b-b5ab-164149b9b688'),
('44444444-4444-4444-4444-444444444444', 'payment', 'Rent Payment - Apr 2026', 'Rent of ₹18,000 paid and verified.', '3159157d-5336-498b-b5ab-164149b9b688'),
('44444444-4444-4444-4444-444444444444', 'payment', 'Rent Payment - May 2026', 'Rent of ₹18,000 paid and verified.', '3159157d-5336-498b-b5ab-164149b9b688'),
('44444444-4444-4444-4444-444444444444', 'payment', 'Rent Payment - Jun 2026', 'Rent of ₹18,000 paid and verified.', '3159157d-5336-498b-b5ab-164149b9b688'),
('44444444-4444-4444-4444-444444444444', 'payment', 'Rent Payment - Jul 2026', 'Rent of ₹18,000 paid and verified.', '3159157d-5336-498b-b5ab-164149b9b688'),
('44444444-4444-4444-4444-444444444444', 'payment', 'Rent Payment - Aug 2026', 'Rent of ₹18,000 paid.', 'd9ac69ab-1995-456c-b845-cb7714022f5f');
