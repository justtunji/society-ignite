import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserPlus, Trash2, KeyRound, ShieldCheck } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { ADMIN_MODULES } from '@/hooks/usePermissions';

type Role = 'admin' | 'editor';
interface ManagedUser {
  id: string;
  email: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  roles: string[];
}

export default function UsersAdmin() {
  const { toast } = useToast();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  // Create form
  const [createOpen, setCreateOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('editor');

  // Reset password
  const [resetTarget, setResetTarget] = useState<ManagedUser | null>(null);
  const [newPassword, setNewPassword] = useState('');

  // Permissions matrix
  const [permsTarget, setPermsTarget] = useState<ManagedUser | null>(null);
  const [permsLoading, setPermsLoading] = useState(false);
  const [permsSaving, setPermsSaving] = useState(false);
  const [permsMap, setPermsMap] = useState<Record<string, { can_create: boolean; can_read: boolean; can_update: boolean; can_delete: boolean }>>({});

  const call = async (action: string, payload: Record<string, unknown> = {}) => {
    const { data, error } = await supabase.functions.invoke('admin-users', {
      body: { action, ...payload },
    });
    if (error) throw error;
    if ((data as any)?.error) throw new Error((data as any).error);
    return data;
  };

  const load = async () => {
    setLoading(true);
    try {
      const data = await call('list');
      setUsers((data as any).users ?? []);
    } catch (e: any) {
      toast({ title: 'Failed to load users', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy('create');
    try {
      await call('create', { email, password, role });
      toast({ title: 'User created', description: `${email} added as ${role}.` });
      setCreateOpen(false);
      setEmail(''); setPassword(''); setRole('editor');
      load();
    } catch (e: any) {
      toast({ title: 'Create failed', description: e.message, variant: 'destructive' });
    } finally {
      setBusy(null);
    }
  };

  const handleRoleChange = async (u: ManagedUser, newRole: Role) => {
    setBusy(u.id);
    try {
      await call('update_role', { user_id: u.id, role: newRole });
      toast({ title: 'Role updated', description: `${u.email} is now ${newRole}.` });
      load();
    } catch (e: any) {
      toast({ title: 'Update failed', description: e.message, variant: 'destructive' });
    } finally {
      setBusy(null);
    }
  };

  const handleDelete = async (u: ManagedUser) => {
    setBusy(u.id);
    try {
      await call('delete', { user_id: u.id });
      toast({ title: 'User deleted', description: u.email ?? u.id });
      load();
    } catch (e: any) {
      toast({ title: 'Delete failed', description: e.message, variant: 'destructive' });
    } finally {
      setBusy(null);
    }
  };

  const handleResetPassword = async () => {
    if (!resetTarget) return;
    setBusy(resetTarget.id);
    try {
      await call('reset_password', { user_id: resetTarget.id, password: newPassword });
      toast({ title: 'Password reset', description: resetTarget.email ?? resetTarget.id });
      setResetTarget(null);
      setNewPassword('');
    } catch (e: any) {
      toast({ title: 'Reset failed', description: e.message, variant: 'destructive' });
    } finally {
      setBusy(null);
    }
  };

  const openPermissions = async (u: ManagedUser) => {
    setPermsTarget(u);
    setPermsLoading(true);
    setPermsMap({});
    try {
      const data = await call('list_permissions', { user_id: u.id });
      const map: Record<string, any> = {};
      ((data as any).permissions ?? []).forEach((p: any) => { map[p.module] = p; });
      // Ensure every known module has an entry
      ADMIN_MODULES.forEach(m => {
        map[m.key] = map[m.key] ?? { can_create: false, can_read: false, can_update: false, can_delete: false };
      });
      setPermsMap(map);
    } catch (e: any) {
      toast({ title: 'Failed to load permissions', description: e.message, variant: 'destructive' });
      setPermsTarget(null);
    } finally {
      setPermsLoading(false);
    }
  };

  const togglePerm = (module: string, action: 'create' | 'read' | 'update' | 'delete', value: boolean) => {
    setPermsMap(prev => ({
      ...prev,
      [module]: { ...prev[module], [`can_${action}`]: value, can_read: action === 'read' ? value : (value ? true : prev[module]?.can_read) },
    }));
  };

  const setRowPreset = (module: string, preset: 'none' | 'read' | 'editor' | 'full') => {
    const presets = {
      none:   { can_create: false, can_read: false, can_update: false, can_delete: false },
      read:   { can_create: false, can_read: true,  can_update: false, can_delete: false },
      editor: { can_create: true,  can_read: true,  can_update: true,  can_delete: false },
      full:   { can_create: true,  can_read: true,  can_update: true,  can_delete: true  },
    };
    setPermsMap(prev => ({ ...prev, [module]: presets[preset] }));
  };

  const applyAllPreset = (preset: 'none' | 'read' | 'editor' | 'full') => {
    const next: typeof permsMap = {};
    ADMIN_MODULES.forEach(m => {
      next[m.key] = ({
        none:   { can_create: false, can_read: false, can_update: false, can_delete: false },
        read:   { can_create: false, can_read: true,  can_update: false, can_delete: false },
        editor: { can_create: true,  can_read: true,  can_update: true,  can_delete: false },
        full:   { can_create: true,  can_read: true,  can_update: true,  can_delete: true  },
      })[preset];
    });
    setPermsMap(next);
  };

  const savePermissions = async () => {
    if (!permsTarget) return;
    setPermsSaving(true);
    try {
      const permissions = ADMIN_MODULES.map(m => ({
        module: m.key,
        ...permsMap[m.key],
      }));
      await call('update_permissions', { user_id: permsTarget.id, permissions });
      toast({ title: 'Permissions saved' });
      setPermsTarget(null);
    } catch (e: any) {
      toast({ title: 'Save failed', description: e.message, variant: 'destructive' });
    } finally {
      setPermsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>Team Access</CardTitle>
            <CardDescription>
              Create accounts for admins and editors. Admins manage everything including users.
              Editors can create and edit all site content but cannot manage roles, settings, or members.
            </CardDescription>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button><UserPlus className="w-4 h-4 mr-2" />Add user</Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleCreate}>
                <DialogHeader>
                  <DialogTitle>Create user</DialogTitle>
                  <DialogDescription>The user can sign in immediately at /admin/login.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="new-email">Email</Label>
                    <Input id="new-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="new-password">Temporary password</Label>
                    <Input id="new-password" type="text" required minLength={8} value={password}
                      onChange={(e) => setPassword(e.target.value)} placeholder="Min 8 characters" />
                  </div>
                  <div>
                    <Label htmlFor="new-role">Role</Label>
                    <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                      <SelectTrigger id="new-role"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="editor">Editor — manage content</SelectItem>
                        <SelectItem value="admin">Admin — full access</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={busy === 'create'}>
                    {busy === 'create' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Create user
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Loading users…
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Last sign in</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => {
                  const currentRole: Role = u.roles.includes('admin')
                    ? 'admin'
                    : u.roles.includes('editor') ? 'editor' : 'editor';
                  const hasRole = u.roles.includes('admin') || u.roles.includes('editor');
                  return (
                    <TableRow key={u.id}>
                      <TableCell>
                        <div className="font-medium">{u.email ?? '—'}</div>
                        <div className="text-xs text-muted-foreground">Joined {new Date(u.created_at).toLocaleDateString()}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Select
                            value={hasRole ? currentRole : ''}
                            onValueChange={(v) => handleRoleChange(u, v as Role)}
                            disabled={busy === u.id}
                          >
                            <SelectTrigger className="w-36"><SelectValue placeholder="No role" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="editor">Editor</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                          {!hasRole && <Badge variant="outline">No access</Badge>}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleString() : 'Never'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => setResetTarget(u)}>
                            <KeyRound className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" disabled={busy === u.id}>
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete {u.email}?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This permanently removes the user account and any role assignments.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(u)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!resetTarget} onOpenChange={(o) => !o && setResetTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset password</DialogTitle>
            <DialogDescription>Set a new password for {resetTarget?.email}.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="reset-pw">New password</Label>
            <Input id="reset-pw" type="text" minLength={8} value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)} placeholder="Min 8 characters" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetTarget(null)}>Cancel</Button>
            <Button onClick={handleResetPassword} disabled={!newPassword || newPassword.length < 8}>
              Update password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
