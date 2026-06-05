import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';
import { withTimeout } from '@/hooks/useAsync';

type Role = 'admin' | 'editor' | null;

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const resolveRole = async (currentUser: User | null) => {
      if (!currentUser) {
        if (!cancelled) { setRole(null); setLoading(false); }
        return;
      }
      try {
        const { data } = await withTimeout<any>(
          supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', currentUser.id)
            .in('role', ['admin', 'editor']) as any,
          8000,
          'role lookup',
        );
        const roles: string[] = (data ?? []).map((r: any) => r.role);
        const resolved: Role = roles.includes('admin') ? 'admin'
          : roles.includes('editor') ? 'editor' : null;
        if (!cancelled) setRole(resolved);
      } catch (err) {
        console.error('[useAuth] role lookup failed', err);
        if (!cancelled) setRole(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setTimeout(() => { resolveRole(currentUser); }, 0);
    });

    withTimeout(supabase.auth.getSession(), 8000, 'session')
      .then(({ data: { session } }) => {
        const currentUser = session?.user ?? null;
        if (!cancelled) setUser(currentUser);
        resolveRole(currentUser);
      })
      .catch((err) => {
        console.error('[useAuth] getSession failed', err);
        if (!cancelled) { setUser(null); setRole(null); setLoading(false); }
      });

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

  const isAdmin = role === 'admin';
  const isEditor = role === 'editor';
  const isStaff = role === 'admin' || role === 'editor';

  return { user, role, isAdmin, isEditor, isStaff, loading, signOut };
};
