-- Create storage bucket for partner logos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('partner-logos', 'partner-logos', true);

-- Create storage policies for partner logos bucket
CREATE POLICY "Partner logos are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'partner-logos');

CREATE POLICY "Authenticated users can upload partner logos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'partner-logos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update partner logos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'partner-logos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete partner logos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'partner-logos' AND auth.role() = 'authenticated');