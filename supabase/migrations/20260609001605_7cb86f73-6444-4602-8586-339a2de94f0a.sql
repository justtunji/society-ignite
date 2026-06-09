
ALTER TABLE public.team_members
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'team';

ALTER TABLE public.team_members_public
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'team';

-- Backfill: anything previously flagged is_featured becomes advisory
UPDATE public.team_members SET category = 'advisory' WHERE is_featured = true AND category = 'team';
UPDATE public.team_members_public SET category = 'advisory' WHERE is_featured = true AND category = 'team';

-- Replace sync trigger function to include category
CREATE OR REPLACE FUNCTION public.sync_team_member_public()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.team_members_public (
            team_member_id, name, title, bio, image_url,
            linkedin_url, twitter_url, order_index, is_featured, category
        ) VALUES (
            NEW.id, NEW.name, NEW.title, NEW.bio, NEW.image_url,
            NEW.linkedin_url, NEW.twitter_url, NEW.order_index, NEW.is_featured,
            COALESCE(NEW.category, 'team')
        );
        RETURN NEW;
    END IF;

    IF TG_OP = 'UPDATE' THEN
        UPDATE public.team_members_public SET
            name = NEW.name,
            title = NEW.title,
            bio = NEW.bio,
            image_url = NEW.image_url,
            linkedin_url = NEW.linkedin_url,
            twitter_url = NEW.twitter_url,
            order_index = NEW.order_index,
            is_featured = NEW.is_featured,
            category = COALESCE(NEW.category, 'team'),
            updated_at = now()
        WHERE team_member_id = NEW.id;
        RETURN NEW;
    END IF;

    IF TG_OP = 'DELETE' THEN
        DELETE FROM public.team_members_public WHERE team_member_id = OLD.id;
        RETURN OLD;
    END IF;

    RETURN NULL;
END;
$function$;
