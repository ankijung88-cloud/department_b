import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User, Session } from '@supabase/supabase-js';

interface Profile {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    role: 'USER' | 'ADMIN';
}

interface AuthContextType {
    user: User | null;
    profile: Profile | null;
    session: Session | null;
    loading: boolean;
    isAdmin: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = useCallback(async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                // If the error is 'PGRST116' (no rows found), it means the profile doesn't exist yet
                // This can happen if the sync script wasn't run or trigger failed.
                if (error.code === 'PGRST116') {
                    console.warn('Profile not found for user:', userId);
                    return null;
                }
                throw error;
            }
            return data as Profile;
        } catch (error: any) {
            console.error('Error fetching profile:', error.message || error);
            return null;
        }
    }, []);

    useEffect(() => {
        let mounted = true;

        const initializeAuth = async () => {
            try {
                const { data: { session: initialSession } } = await supabase.auth.getSession();

                if (!mounted) return;

                setSession(initialSession);
                setUser(initialSession?.user ?? null);

                if (initialSession?.user) {
                    const profileData = await fetchProfile(initialSession.user.id);
                    if (mounted) {
                        setProfile(profileData);
                    }
                }
            } catch (err) {
                console.error('Auth initialization error:', err);
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        initializeAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
            if (!mounted) return;

            setSession(currentSession);
            setUser(currentSession?.user ?? null);

            if (currentSession?.user) {
                const profileData = await fetchProfile(currentSession.user.id);
                if (mounted) {
                    setProfile(profileData);
                }
            } else {
                setProfile(null);
            }

            if (event === 'SIGNED_OUT') {
                if (mounted) {
                    setLoading(false);
                }
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, [fetchProfile]);

    const signOut = async () => {
        console.log('AuthContext: Force signOut starting...');

        // 1. Clear state locally first (UI reacts immediately)
        setSession(null);
        setUser(null);
        setProfile(null);

        // 2. Clear all possible Supabase tokens from localStorage
        Object.keys(localStorage).forEach(key => {
            if (key.includes('supabase.auth.token') || key.startsWith('sb-')) {
                localStorage.removeItem(key);
            }
        });

        console.log('AuthContext: Local state cleared');

        try {
            // 3. Attempt server-side signOut (asynchronous, non-blocking)
            supabase.auth.signOut().catch(err => console.error('Server-side logout failed:', err));
        } finally {
            console.log('AuthContext: Redirecting to home...');
            // 4. Force reload/redirect to ensure all contexts are reset
            window.location.href = '/';
        }
    };

    const value = {
        user,
        profile,
        session,
        loading,
        isAdmin: profile?.role === 'ADMIN',
        signOut,
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
