"use client";

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient'; // Ensure correct path

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({ 
  session: null, 
  user: null, 
  loading: true 
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes in auth state (login, logout, etc.)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`AuthProvider: Supabase auth event: ${event}`);
        // Add a check: Do not immediately update state if it's the recovery event,
        // let the dedicated page handle it first based on the hash.
        if (event === 'PASSWORD_RECOVERY') {
          console.log('AuthProvider: Ignoring PASSWORD_RECOVERY event for state update.');
          // We might still want to stop loading if it was loading
          // setLoading(false); // Decide if this is needed or handled elsewhere
          return; // Don't set session/user yet
        }

        // For other events (SIGNED_IN, SIGNED_OUT, etc.) update as normal
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false); // Ensure loading is false after state change
      }
    );

    // Cleanup listener on component unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user,
    loading,
  };

  // Don't render children until loading is complete to avoid flash of unauthenticated state
  return (
    <AuthContext.Provider value={value}>
      {!loading && children} 
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
