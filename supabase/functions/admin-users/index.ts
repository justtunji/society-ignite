import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type Role = 'admin' | 'editor';

interface PermissionInput {
  module: string;
  can_create?: boolean;
  can_read?: boolean;
  can_update?: boolean;
  can_delete?: boolean;
}

interface Action {
  action: 'list' | 'create' | 'update_role' | 'delete' | 'reset_password'
        | 'list_permissions' | 'update_permissions';
  email?: string;
  password?: string;
  role?: Role;
  user_id?: string;
  permissions?: PermissionInput[];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;

  try {
    const authHeader = req.headers.get('Authorization') ?? '';
    if (!authHeader) return json({ error: 'Unauthorized' }, 401);

    // Verify caller is admin
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userErr } = await userClient.auth.getUser();
    if (userErr || !user) return json({ error: 'Unauthorized' }, 401);

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: roles } = await admin.from('user_roles').select('role').eq('user_id', user.id);
    const isAdmin = (roles ?? []).some((r: any) => r.role === 'admin');
    if (!isAdmin) return json({ error: 'Forbidden — admin only' }, 403);

    const body = (await req.json().catch(() => ({}))) as Action;

    switch (body.action) {
      case 'list': {
        const { data: usersData, error } = await admin.auth.admin.listUsers({ perPage: 200 });
        if (error) throw error;
        const { data: allRoles } = await admin.from('user_roles').select('user_id, role');
        const rolesByUser: Record<string, string[]> = {};
        (allRoles ?? []).forEach((r: any) => {
          (rolesByUser[r.user_id] ||= []).push(r.role);
        });
        const list = usersData.users.map((u) => ({
          id: u.id,
          email: u.email,
          created_at: u.created_at,
          last_sign_in_at: u.last_sign_in_at,
          roles: rolesByUser[u.id] ?? [],
        }));
        return json({ users: list });
      }
      case 'create': {
        if (!body.email || !body.password || !body.role) return json({ error: 'email, password, role required' }, 400);
        if (!['admin', 'editor'].includes(body.role)) return json({ error: 'invalid role' }, 400);
        if (body.password.length < 8) return json({ error: 'password must be at least 8 characters' }, 400);
        const { data: created, error } = await admin.auth.admin.createUser({
          email: body.email,
          password: body.password,
          email_confirm: true,
        });
        if (error) throw error;
        const { error: roleErr } = await admin.from('user_roles').insert({ user_id: created.user.id, role: body.role });
        if (roleErr) throw roleErr;
        return json({ ok: true, user: { id: created.user.id, email: created.user.email } });
      }
      case 'update_role': {
        if (!body.user_id || !body.role) return json({ error: 'user_id and role required' }, 400);
        if (!['admin', 'editor'].includes(body.role)) return json({ error: 'invalid role' }, 400);
        await admin.from('user_roles').delete().eq('user_id', body.user_id);
        const { error } = await admin.from('user_roles').insert({ user_id: body.user_id, role: body.role });
        if (error) throw error;
        return json({ ok: true });
      }
      case 'delete': {
        if (!body.user_id) return json({ error: 'user_id required' }, 400);
        if (body.user_id === user.id) return json({ error: 'cannot delete yourself' }, 400);
        const { error } = await admin.auth.admin.deleteUser(body.user_id);
        if (error) throw error;
        return json({ ok: true });
      }
      case 'reset_password': {
        if (!body.user_id || !body.password) return json({ error: 'user_id and password required' }, 400);
        if (body.password.length < 8) return json({ error: 'password must be at least 8 characters' }, 400);
        const { error } = await admin.auth.admin.updateUserById(body.user_id, { password: body.password });
        if (error) throw error;
        return json({ ok: true });
      }
      case 'list_permissions': {
        if (!body.user_id) return json({ error: 'user_id required' }, 400);
        const { data, error } = await admin
          .from('user_permissions')
          .select('module, can_create, can_read, can_update, can_delete')
          .eq('user_id', body.user_id);
        if (error) throw error;
        return json({ permissions: data ?? [] });
      }
      case 'update_permissions': {
        if (!body.user_id || !Array.isArray(body.permissions)) {
          return json({ error: 'user_id and permissions required' }, 400);
        }
        // Replace all permissions for this user atomically.
        const rows = body.permissions
          .filter((p) => p && typeof p.module === 'string' && p.module.trim())
          .map((p) => ({
            user_id: body.user_id,
            module: p.module,
            can_create: !!p.can_create,
            can_read:   !!p.can_read,
            can_update: !!p.can_update,
            can_delete: !!p.can_delete,
          }));
        const { error: delErr } = await admin.from('user_permissions').delete().eq('user_id', body.user_id);
        if (delErr) throw delErr;
        if (rows.length) {
          const { error: insErr } = await admin.from('user_permissions').insert(rows);
          if (insErr) throw insErr;
        }
        return json({ ok: true, count: rows.length });
      }
      default:
        return json({ error: 'unknown action' }, 400);
    }
  } catch (err: any) {
    console.error('[admin-users] error', err);
    return json({ error: err?.message ?? 'Internal error' }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
