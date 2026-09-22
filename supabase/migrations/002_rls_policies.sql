-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE rental_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE rental_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is a participant in an agreement
CREATE OR REPLACE FUNCTION is_agreement_participant(ag_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM rental_agreements
    WHERE id = ag_id AND (tenant_id = auth.uid() OR landlord_id = auth.uid())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can view profiles linked via agreements"
ON profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM rental_agreements
    WHERE (tenant_id = auth.uid() AND landlord_id = profiles.id)
       OR (landlord_id = auth.uid() AND tenant_id = profiles.id)
  )
);

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);


-- Properties Policies
CREATE POLICY "Landlords can view their own properties"
ON properties FOR SELECT
USING (landlord_id = auth.uid());

CREATE POLICY "Tenants can view properties they rent"
ON properties FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM rental_agreements
    WHERE property_id = properties.id AND tenant_id = auth.uid()
  )
);

CREATE POLICY "Landlords can insert properties"
ON properties FOR INSERT
WITH CHECK (landlord_id = auth.uid());

CREATE POLICY "Landlords can update their properties"
ON properties FOR UPDATE
USING (landlord_id = auth.uid());

CREATE POLICY "Landlords can delete their properties"
ON properties FOR DELETE
USING (landlord_id = auth.uid());


-- Rental Agreements Policies
CREATE POLICY "Participants can view agreements"
ON rental_agreements FOR SELECT
USING (tenant_id = auth.uid() OR landlord_id = auth.uid());

CREATE POLICY "Landlords can insert agreements"
ON rental_agreements FOR INSERT
WITH CHECK (landlord_id = auth.uid());

CREATE POLICY "Participants can update agreements"
ON rental_agreements FOR UPDATE
USING (tenant_id = auth.uid() OR landlord_id = auth.uid());


-- Payments Policies
CREATE POLICY "Participants can view payments"
ON payments FOR SELECT
USING (is_agreement_participant(agreement_id));

CREATE POLICY "Tenants can insert payments"
ON payments FOR INSERT
WITH CHECK (tenant_id = auth.uid() AND is_agreement_participant(agreement_id));

CREATE POLICY "Participants can update payments"
ON payments FOR UPDATE
USING (is_agreement_participant(agreement_id));


-- Maintenance Requests Policies
CREATE POLICY "Participants can view maintenance requests"
ON maintenance_requests FOR SELECT
USING (is_agreement_participant(agreement_id));

CREATE POLICY "Participants can insert maintenance requests"
ON maintenance_requests FOR INSERT
WITH CHECK (reported_by = auth.uid() AND is_agreement_participant(agreement_id));

CREATE POLICY "Participants can update maintenance requests"
ON maintenance_requests FOR UPDATE
USING (is_agreement_participant(agreement_id));


-- Property Inspections Policies
CREATE POLICY "Participants can view inspections"
ON property_inspections FOR SELECT
USING (is_agreement_participant(agreement_id));

CREATE POLICY "Landlords can insert inspections"
ON property_inspections FOR INSERT
WITH CHECK (inspector_id = auth.uid() AND is_agreement_participant(agreement_id));

CREATE POLICY "Participants can update inspections"
ON property_inspections FOR UPDATE
USING (is_agreement_participant(agreement_id));


-- Documents Policies
CREATE POLICY "Participants can view documents"
ON documents FOR SELECT
USING (is_agreement_participant(agreement_id));

CREATE POLICY "Participants can insert documents"
ON documents FOR INSERT
WITH CHECK (uploaded_by = auth.uid() AND is_agreement_participant(agreement_id));


-- Evidence Policies
CREATE POLICY "Participants can view evidence"
ON evidence FOR SELECT
USING (is_agreement_participant(agreement_id));

CREATE POLICY "Participants can insert evidence"
ON evidence FOR INSERT
WITH CHECK (uploaded_by = auth.uid() AND is_agreement_participant(agreement_id));


-- Rental Events Policies
CREATE POLICY "Participants can view events"
ON rental_events FOR SELECT
USING (is_agreement_participant(agreement_id));

CREATE POLICY "Participants can insert events"
ON rental_events FOR INSERT
WITH CHECK (created_by = auth.uid() AND is_agreement_participant(agreement_id));


-- Messages Policies
CREATE POLICY "Participants can view messages"
ON messages FOR SELECT
USING (is_agreement_participant(agreement_id));

CREATE POLICY "Participants can insert messages"
ON messages FOR INSERT
WITH CHECK (sender_id = auth.uid() AND is_agreement_participant(agreement_id));

CREATE POLICY "Participants can update messages"
ON messages FOR UPDATE
USING (is_agreement_participant(agreement_id));
