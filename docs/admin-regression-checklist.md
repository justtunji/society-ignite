# Admin Pages — Slow Network & Stalled Request Regression Checklist

Use this checklist after any change to `useAuth`, `useAsync`, `CrudPage`,
`ImageUpload`, `AdminLayout`, or storage / RLS policies. Goal: confirm every
admin page **always** recovers (never hangs on "Loading…") and that failures
are visible in the **Errors** panel in the admin header.

## 1. Set up Chrome DevTools throttling

1. Open the app at `/admin/login` and sign in.
2. Open DevTools → **Network** tab → throttling dropdown.
3. Create a custom profile **"Stalled"**:
   - Download: `1 kb/s`, Upload: `1 kb/s`, Latency: `20000 ms`.
4. Keep the default **"Slow 3G"** profile available too.

## 2. Pages to verify

Run each scenario on every admin page:

- `/admin` (Dashboard)
- `/admin/site-settings`
- `/admin/navigation`
- `/admin/partners`
- `/admin/team`
- `/admin/gallery`
- `/admin/events`
- `/admin/programs`
- `/admin/promotions`
- `/admin/resources`
- `/admin/stories`
- `/admin/communities`
- `/admin/members`
- `/admin/contacts`

## 3. Scenarios

### A. Slow page load (Slow 3G)
- [ ] Spinner + "Loading…" appears within 1s.
- [ ] Page resolves to data or error within 15s.
- [ ] No blank screen, no infinite spinner.

### B. Stalled load (Stalled profile)
- [ ] After ~15s the page shows the **AsyncBoundary** error card with
      "Couldn't load this section" + a **Retry** button.
- [ ] Header **Errors** badge increments and lists a `timeout` entry with
      label `load`, the scope (table name where applicable), duration,
      and Supabase error message/code/details/hint when present.
- [ ] Switching network to **Online** and clicking **Retry** loads data.

### C. Stalled save (CrudPage Add/Edit dialog)
- [ ] Click **Save** with Stalled throttling.
- [ ] Button shows "Saving…" spinner; dialog stays open.
- [ ] After ~15s: toast "Save failed — save timed out after 15s".
- [ ] **Errors** panel records `insert` or `update` with table scope.
- [ ] Switch back to Online, retry save → succeeds.

### D. Stalled delete
- [ ] Confirm delete with Stalled throttling.
- [ ] Row spinner appears; after ~15s: toast "Delete failed".
- [ ] **Errors** panel records `delete` with table scope.

### E. Stalled image upload (`ImageUpload`)
- [ ] Choose an image with Stalled throttling.
- [ ] "Uploading…" indicator appears.
- [ ] After ~30s: toast with timeout error.
- [ ] **Errors** panel records the upload failure.
- [ ] Online retry uploads successfully and returns a public URL.

### F. Auth bootstrap stall
- [ ] Hard reload `/admin` with Stalled throttling.
- [ ] After ≤10s the safety net resolves loading; redirect to `/admin/login`
      if no session, otherwise the layout renders.
- [ ] No infinite "Loading..." screen.

### G. Refresh button
- [ ] On every CrudPage and `/admin/contacts`, click **Refresh** while
      online → spinner toggles, list updates.
- [ ] Click **Refresh** while stalled → resolves to error card; recovery
      via Retry works.

### H. Stale dynamic-import recovery
- [ ] In DevTools → Network, **Block request URL** for one admin page chunk
      (e.g. `ResourcesAdmin`).
- [ ] Navigate to that page → `main.tsx` chunk handler triggers a single
      reload (sessionStorage key prevents loops).
- [ ] Unblock, reload manually → page loads normally.

## 4. Error report panel checks

- [ ] Header shows **Errors** button; turns destructive red when count > 0.
- [ ] Opening the panel lists entries newest-first with HH:mm:ss timestamp
      and duration in ms.
- [ ] **Copy** button writes JSON to clipboard.
- [ ] **Clear** empties the buffer and resets the badge.
- [ ] Buffer caps at 25 entries (older ones drop off).

## 5. Pass criteria

A release is good to ship when **every** checkbox above passes on at least
the Dashboard, Partners, Team, Resources, and Contacts pages, and the
**Errors** panel surfaces a matching entry for each induced failure.
