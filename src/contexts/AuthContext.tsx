import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    isSupabaseEnabled: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    loading: true,
    isSupabaseEnabled: false,
});

export function useAuth() {
    return useContext(AuthContext);
}

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    const isSupabaseEnabled = supabase !== null;

    useEffect(() => {
        if (!supabase) {
            setLoading(false);
            return;
        }

        // Check for existing session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setSession(session);
                setUser(session.user);
                setLoading(false);
            } else {
                // Sign in anonymously
                supabase.auth.signInAnonymously().then(({ data, error }) => {
                    if (error) {
                        console.error('Anonymous auth error:', error);
                    } else {
                        setSession(data.session);
                        setUser(data.user);
                    }
                    setLoading(false);
                });
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, session, loading, isSupabaseEnabled }}>
            {children}
        </AuthContext.Provider>
    );
}
