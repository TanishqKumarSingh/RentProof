import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Profile, RentalAgreement } from '../types';
import { signIn as authSignIn, signOut as authSignOut } from '../services/authService';
import { DEMO_TENANT, DEMO_LANDLORD, DEMO_AGREEMENT } from '../lib/demoData';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  agreement: RentalAgreement | null;
  loading: boolean;
  signIn: typeof authSignIn;
  signOut: () => Promise<any>;
  isLandlord: boolean;
  isDemoMode: boolean;
  demoLogin: (role: 'tenant' | 'landlord') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [agreement, setAgreement] = useState<RentalAgreement | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Demo login — no Supabase needed
  const demoLogin = (role: 'tenant' | 'landlord') => {
    const demoProfile = role === 'tenant' ? DEMO_TENANT : DEMO_LANDLORD;
    setProfile(demoProfile);
    setAgreement(DEMO_AGREEMENT);
    setIsDemoMode(true);
    // Create a minimal fake User object so ProtectedRoute works
    setUser({ id: demoProfile.id, email: demoProfile.email } as User);
  };

  const handleSignOut = async () => {
    if (isDemoMode) {
      setUser(null);
      setProfile(null);
      setAgreement(null);
      setIsDemoMode(false);
      return { error: null };
    }
    const result = await authSignOut();
    setUser(null);
    setProfile(null);
    setAgreement(null);
    return result;
  };

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    const fetchUserData = async (currentUser: User | null) => {
      setUser(currentUser);
      if (!currentUser) {
        setProfile(null);
        setAgreement(null);
        setLoading(false);
        return;
      }

      try {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single();
        
        setProfile(profileData);

        if (profileData) {
          const roleColumn = profileData.role === 'tenant' ? 'tenant_id' : 'landlord_id';
          const { data: agreementData } = await supabase
            .from('rental_agreements')
            .select('*, property:properties(*), tenant:profiles!rental_agreements_tenant_id_fkey(*), landlord:profiles!rental_agreements_landlord_id_fkey(*)')
            .eq(roleColumn, profileData.id)
            .eq('status', 'active')
            .single();

          setAgreement(agreementData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      fetchUserData(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchUserData(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    profile,
    agreement,
    loading,
    signIn: authSignIn,
    signOut: handleSignOut,
    isLandlord: profile?.role === 'landlord',
    isDemoMode,
    demoLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
