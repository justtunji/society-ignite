import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';
import { withTimeout } from '@/hooks/useAsync';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const resolveAdmin = async (currentUser: User | null) => {
      if (!currentUser) {
        if (!cancelled) { setIsAdmin(false); setLoading(false); }
        return;
      }
      try {
        const { data } = await withTimeout(
          supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', currentUser.id)
            .eq('role', 'admin')
            .maybeSingle(),
          8000,
          'role lookup',
        );
        if (!cancelled) setIsAdmin(!!data);
      } catch (err) {
        console.error('[useAuth] role lookup failed', err);
        if (!cancelled) setIsAdmin(false);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      // defer to avoid blocking the auth callback
      setTimeout(() => { resolveAdmin(currentUser); }, 0);
    });

    // Bootstrap session with a hard timeout so we never hang on "Loading…"
    withTimeout(supabase.auth.getSession(), 8000, 'session')
      .then(({ data: { session } }) => {
        const currentUser = session?.user ?? null;
        if (!cancelled) setUser(currentUser);
        resolveAdmin(currentUser);
      })
      .catch((err) => {
        console.error('[useAuth] getSession failed', err);
        if (!cancelled) { setUser(null); setIsAdmin(false); setLoading(false); }
      });

    // Absolute safety net
    const safety = setTimeout(() => { if (!cancelled) setLoading(false); }, 10000);

    return () => {
      cancelled = true;
      clearTimeout(safety);
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, isAdmin, loading, signOut };
};
