import { supabase } from '../lib/supabase';
import { RentalEvent } from '../types';

export const getEvents = async (
  agreementId: string, 
  filters?: { eventType?: string; startDate?: string; endDate?: string; search?: string }
) => {
  let query = supabase
    .from('rental_events')
    .select('*, creator:profiles!rental_events_created_by_fkey(*)')
    .eq('agreement_id', agreementId)
    .order('created_at', { ascending: false });

  if (filters?.eventType) query = query.eq('event_type', filters.eventType);
  if (filters?.startDate) query = query.gte('created_at', filters.startDate);
  if (filters?.endDate) query = query.lte('created_at', filters.endDate);
  if (filters?.search) query = query.ilike('title', `%${filters.search}%`);

  const { data, error } = await query;
  if (error) throw error;
  return data as RentalEvent[];
};

export const createEvent = async (data: Partial<RentalEvent>) => {
  const { data: event, error } = await supabase
    .from('rental_events')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return event;
};

export const getRecentEvents = async (agreementId: string, limit: number) => {
  const { data, error } = await supabase
    .from('rental_events')
    .select('*, creator:profiles!rental_events_created_by_fkey(*)')
    .eq('agreement_id', agreementId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as RentalEvent[];
};
