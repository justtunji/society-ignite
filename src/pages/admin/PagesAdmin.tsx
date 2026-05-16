import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Layers } from 'lucide-react';
import CrudPage from './CrudPage';

const PagesAdmin = () => (
  <CrudPage
    title="Pages"
    tableName="pages"
    orderBy="created_at"
    orderAsc={false}
    fields={[
      { name: 'title', label: 'Title', type: 'text', required: true, showInTable: true },
      { name: 'slug', label: 'Slug', type: 'text', required: true, showInTable: true },
      { name: 'excerpt', label: 'Excerpt', type: 'textarea' },
      { name: 'status', label: 'Status', type: 'select', defaultValue: 'published', showInTable: true,
        options: [
          { label: 'Draft', value: 'draft' },
          { label: 'Published', value: 'published' },
          { label: 'Archived', value: 'archived' },
        ] },
      { name: 'is_homepage', label: 'Homepage', type: 'boolean', defaultValue: false, showInTable: true },
      { name: 'seo_title', label: 'SEO Title', type: 'text' },
      { name: 'seo_description', label: 'SEO Description', type: 'textarea' },
      { name: 'og_image_url', label: 'Open Graph Image', type: 'image' },
    ]}
    customActions={(item) => (
      <Button asChild size="icon" variant="ghost" title="Manage sections">
        <Link to={`/admin/sections?pageId=${item.id}`}><Layers size={16} /></Link>
      </Button>
    )}
  />
);

export default PagesAdmin;
