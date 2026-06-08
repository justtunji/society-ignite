
-- Per-module permissions for editors. Admins always pass via has_permission.
CREATE TABLE IF NOT EXISTS public.user_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module text NOT NULL,
  can_create boolean NOT NULL DEFAULT false,
  can_read   boolean NOT NULL DEFAULT true,
  can_update boolean NOT NULL DEFAULT false,
  can_delete boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, module)
);

GRANT SELECT ON public.user_permissions TO authenticated;
GRANT ALL ON public.user_permissions TO service_role;

ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;

-- Users may read their own permissions; admins may read all.
CREATE POLICY "Read own permissions"
  ON public.user_permissions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Only admins write permissions (edge function uses service_role; this is a safety net).
CREATE POLICY "Admins manage permissions"
  ON public.user_permissions FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_user_permissions_updated_at
  BEFORE UPDATE ON public.user_permissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Permission check used throughout the app. Admins always pass.
CREATE OR REPLACE FUNCTION public.has_permission(_user_id uuid, _module text, _action text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    public.has_role(_user_id, 'admin')
    OR EXISTS (
      SELECT 1 FROM public.user_permissions
      WHERE user_id = _user_id
        AND module  = _module
        AND CASE _action
              WHEN 'create' THEN can_create
              WHEN 'read'   THEN can_read
              WHEN 'update' THEN can_update
              WHEN 'delete' THEN can_delete
              ELSE false
            END
    );
$$;

-- Backfill: give every existing editor full perms on every known module so no
-- one loses access. New users start with no perms until granted.
INSERT INTO public.user_permissions (user_id, module, can_create, can_read, can_update, can_delete)
SELECT ur.user_id, m.module, true, true, true, true
FROM public.user_roles ur
CROSS JOIN (VALUES
  ('partners'),('team'),('gallery'),('events'),('programs'),
  ('promotions'),('resources'),('stories'),('communities'),
  ('members'),('contacts'),('site_settings')
) AS m(module)
WHERE ur.role = 'editor'
ON CONFLICT (user_id, module) DO NOTHING;
