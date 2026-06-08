import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export type PermissionAction = 'create' | 'read' | 'update' | 'delete';

export interface ModulePermissions {
  can_create: boolean;
  can_read: boolean;
  can_update: boolean;
  can_delete: boolean;
}

const EMPTY: ModulePermissions = {
  can_create: false, can_read: false, can_update: false, can_delete: false,
};

const ALL: ModulePermissions = {
  can_create: true, can_read: true, can_update: true, can_delete: true,
};

export const ADMIN_MODULES = [
  { key: 'pages',         label: 'Pages (builder)' },
  { key: 'navigation',    label: 'Navigation Menu' },
  { key: 'sections',      label: 'Site Sections' },
  { key: 'design',        label: 'Design System' },
  { key: 'partners',      label: 'Partners' },
  { key: 'team',          label: 'Team Members' },
  { key: 'gallery',       label: 'Gallery' },
  { key: 'events',        label: 'Events' },
  { key: 'programs',      label: 'Programs' },
  { key: 'promotions',    label: 'Promotions' },
  { key: 'resources',     label: 'Resources' },
  { key: 'stories',       label: 'Stories' },
  
  { key: 'members',       label: 'Members' },
  { key: 'contacts',      label: 'Contact Submissions' },
  { key: 'site_settings', label: 'Site Settings' },
] as const;

export const usePermissions = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [permissions, setPermissions] = useState<Record<string, ModulePermissions>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (authLoading) return;
    if (!user) { setPermissions({}); setLoading(false); return; }

    (async () => {
      const { data } = await supabase
        .from('user_permissions')
        .select('module, can_create, can_read, can_update, can_delete')
        .eq('user_id', user.id);
      if (cancelled) return;
      const map: Record<string, ModulePermissions> = {};
      (data ?? []).forEach((p: any) => { map[p.module] = p; });
      setPermissions(map);
      setLoading(false);
    })();

    return () => { cancelled = true; };
  }, [user, authLoading]);

  const can = (module: string, action: PermissionAction): boolean => {
    if (isAdmin) return true;
    const p = permissions[module] ?? EMPTY;
    return p[`can_${action}` as keyof ModulePermissions];
  };

  const moduleAccess = (module: string): ModulePermissions =>
    isAdmin ? ALL : (permissions[module] ?? EMPTY);

  return { can, moduleAccess, permissions, loading, isAdmin };
};
