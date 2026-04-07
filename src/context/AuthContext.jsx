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
      async signIn(credentials) {
        if (!supabase) {
          return { error: new Error('Λείπει η ρύθμιση του Supabase.') };
        }

        return supabase.auth.signInWithPassword(credentials);
      },
      async signOut() {
        if (!supabase) {
          return { error: null };
        }

        return supabase.auth.signOut();
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