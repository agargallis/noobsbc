import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setAuthLoading(false);
      return undefined;
    }

    let isActive = true;

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!isActive) {
          return;
        }

        if (error) {
          console.error('Failed to read Supabase session:', error);
        }

        setSession(data.session ?? null);
        setAuthLoading(false);
      })
      .catch((error) => {
        if (!isActive) {
          return;
        }

        console.error('Failed to initialize Supabase auth:', error);
        setSession(null);
        setAuthLoading(false);
      });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null);
      setAuthLoading(false);
    });

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      isSupabaseConfigured,
      session,
      user: session?.user ?? null,
      isAuthenticated: Boolean(session?.user),
      authLoading,
      async signIn(credentialsOrEmail, password) {
        if (!supabase) {
          throw new Error('?????? ? ??????? ??? Supabase.');
        }

        const credentials =
          typeof credentialsOrEmail === 'string'
            ? { email: credentialsOrEmail, password }
            : credentialsOrEmail;

        const { data, error } = await supabase.auth.signInWithPassword(credentials);

        if (error) {
          throw error;
        }

        return data;
      },
      async signOut() {
        if (!supabase) {
          return null;
        }

        const { error } = await supabase.auth.signOut();

        if (error) {
          throw error;
        }

        return null;
      }
    }),
    [authLoading, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider.');
  }

  return context;
}
