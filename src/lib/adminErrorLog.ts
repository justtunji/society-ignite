/**
 * Admin error log — in-memory ring buffer + pub/sub.
 * Captures the last N failed admin operations with timestamps and full
 * Supabase error details so admins can diagnose stalls without DevTools.
 */

export interface AdminLogEntry {
  id: string;
  timestamp: number;
  label: string;        // e.g. "load partners", "save", "delete"
  scope?: string;       // e.g. table name or page
  durationMs?: number;
  status: 'error' | 'timeout' | 'info';
  message: string;
  code?: string;
  details?: string;
  hint?: string;
}

const MAX = 25;
let entries: AdminLogEntry[] = [];
const listeners = new Set<(e: AdminLogEntry[]) => void>();

const emit = () => listeners.forEach((l) => l(entries));

export const adminLog = {
  list: () => entries,
  subscribe(fn: (e: AdminLogEntry[]) => void) {
    listeners.add(fn);
    fn(entries);
    return () => listeners.delete(fn);
  },
  push(entry: Omit<AdminLogEntry, 'id' | 'timestamp'>) {
    const full: AdminLogEntry = {
      id: Math.random().toString(36).slice(2),
      timestamp: Date.now(),
      ...entry,
    };
    entries = [full, ...entries].slice(0, MAX);
    // Mirror to console for power users.
    // eslint-disable-next-line no-console
    console[entry.status === 'info' ? 'log' : 'warn'](
      `[admin:${entry.status}] ${entry.label}`,
      full,
    );
    emit();
    return full;
  },
  clear() {
    entries = [];
    emit();
  },
};

/**
 * Wrap an admin Supabase request with timing + automatic error logging.
 * Use this anywhere admin code awaits a Supabase call.
 */
export async function logAdminRequest<T>(
  label: string,
  fn: () => Promise<T>,
  scope?: string,
): Promise<T> {
  const start = performance.now();
  try {
    const result: any = await fn();
    const durationMs = Math.round(performance.now() - start);
    // Supabase responses surface errors on the `.error` field.
    if (result && typeof result === 'object' && 'error' in result && result.error) {
      const e = result.error;
      adminLog.push({
        label,
        scope,
        durationMs,
        status: 'error',
        message: e.message || 'Supabase error',
        code: e.code,
        details: e.details,
        hint: e.hint,
      });
    }
    return result;
  } catch (err: any) {
    const durationMs = Math.round(performance.now() - start);
    const isTimeout = /timed out/i.test(err?.message || '');
    adminLog.push({
      label,
      scope,
      durationMs,
      status: isTimeout ? 'timeout' : 'error',
      message: err?.message || String(err),
      code: err?.code,
      details: err?.details,
      hint: err?.hint,
    });
    throw err;
  }
}
