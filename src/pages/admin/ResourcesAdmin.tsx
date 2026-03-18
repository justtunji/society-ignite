import CrudPage from './CrudPage';

const resourceTypeOptions = [
  { label: 'SBA Update', value: 'sba-update' },
  { label: 'PDF', value: 'PDF' },
  { label: 'Video', value: 'Video' },
  { label: 'Guide', value: 'Guide' },
];

const ResourcesAdmin = () => (
  <CrudPage
    title="Resources"
    tableName="resources"
    orderBy="published_at"
    orderAsc={false}
    fields={[
      { name: 'title', label: 'Title', type: 'text', required: true, showInTable: true },
      { name: 'slug', label: 'Slug', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea', showInTable: true },
      { name: 'resource_type', label: 'Type', type: 'select', options: resourceTypeOptions, defaultValue: 'PDF', showInTable: true },
      { name: 'thumbnail_url', label: 'Thumbnail', type: 'image', showInTable: true },
      { name: 'file_url', label: 'File URL', type: 'url' },
      { name: 'published_at', label: 'Published At', type: 'datetime' },
      { name: 'year', label: 'Year', type: 'number', showInTable: true },
      { name: 'topics', label: 'Topics', type: 'tags' },
    ]}
  />
);

export default ResourcesAdmin;
