DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Public can view CMS media'
  ) THEN
    CREATE POLICY "Public can view CMS media"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id IN ('cms-media', 'partner-logos'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Admins can upload CMS media'
  ) THEN
    CREATE POLICY "Admins can upload CMS media"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
      bucket_id IN ('cms-media', 'partner-logos')
      AND public.has_role(auth.uid(), 'admin'::public.app_role)
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Admins can update CMS media'
  ) THEN
    CREATE POLICY "Admins can update CMS media"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (
      bucket_id IN ('cms-media', 'partner-logos')
      AND public.has_role(auth.uid(), 'admin'::public.app_role)
    )
    WITH CHECK (
      bucket_id IN ('cms-media', 'partner-logos')
      AND public.has_role(auth.uid(), 'admin'::public.app_role)
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Admins can delete CMS media'
  ) THEN
    CREATE POLICY "Admins can delete CMS media"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (
      bucket_id IN ('cms-media', 'partner-logos')
      AND public.has_role(auth.uid(), 'admin'::public.app_role)
    );
  END IF;
END $$;