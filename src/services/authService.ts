import { supabase } from '../lib/supabase';

export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
};

export const signUp = async (email: string, password: string, fullName: string, role: 'tenant' | 'landlord') => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) return { data, error };
  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        full_name: fullName,
        email,
        role,
      });
    if (profileError) return { data, error: profileError };
  }
  
  return { data, error: null };
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const demoSignIn = async (role: 'tenant' | 'landlord') => {
  const email = role === 'tenant' ? 'tenant@rentproof.demo' : 'landlord@rentproof.demo';
  const password = 'demo123';
  return await signIn(email, password);
};
