
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at timestamptz DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create storage bucket for CMS media uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('cms-media', 'cms-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for cms-media bucket
CREATE POLICY "CMS media is publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'cms-media');

CREATE POLICY "Authenticated users can upload CMS media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'cms-media');

CREATE POLICY "Authenticated users can update CMS media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'cms-media');

CREATE POLICY "Authenticated users can delete CMS media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'cms-media');

-- Create a stories table for the Latest Stories section
CREATE TABLE public.stories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    slug text NOT NULL UNIQUE,
    image_url text,
    short_description text,
    link text,
    featured boolean DEFAULT false,
    order_index integer DEFAULT 0,
    published_at timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Stories are viewable by everyone"
ON public.stories FOR SELECT
USING (true);

CREATE POLICY "Stories are editable by authenticated users only"
ON public.stories FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at
CREATE TRIGGER update_stories_updated_at
BEFORE UPDATE ON public.stories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create communities table
CREATE TABLE public.communities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    link text,
    order_index integer DEFAULT 0,
    visible boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Communities are viewable by everyone"
ON public.communities FOR SELECT
USING (visible = true);

CREATE POLICY "Communities are editable by admins only"
ON public.communities FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_communities_updated_at
BEFORE UPDATE ON public.communities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
