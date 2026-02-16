import CrudPage from './CrudPage';

const ProgramsAdmin = () => (
  <CrudPage
    title="Programs"
    tableName="programs"
    orderBy="created_at"
    orderAsc={false}
    fields={[
      { name: 'title', label: 'Title', type: 'text', required: true, showInTable: true },
      { name: 'slug', label: 'Slug', type: 'text' },
      { name: 'short_description', label: 'Short Description', type: 'textarea', showInTable: true },
      { name: 'long_description', label: 'Full Description', type: 'textarea' },
      { name: 'hero_image_url', label: 'Hero Image', type: 'image', showInTable: true },
      { name: 'program_type', label: 'Program Type', type: 'text', showInTable: true },
      { name: 'start_date', label: 'Start Date', type: 'date' },
      { name: 'end_date', label: 'End Date', type: 'date' },
      { name: 'location_mode', label: 'Location Mode', type: 'text' },
      { name: 'location_text', label: 'Location', type: 'text' },
      { name: 'eligibility', label: 'Eligibility', type: 'textarea' },
      { name: 'application_url', label: 'Application URL', type: 'url' },
      { name: 'status', label: 'Status', type: 'text', defaultValue: 'active', showInTable: true },
      { name: 'tags', label: 'Tags', type: 'tags' },
    ]}
  />
);

export default ProgramsAdmin;
