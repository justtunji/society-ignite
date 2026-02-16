import CrudPage from './CrudPage';

const EventsAdmin = () => (
  <CrudPage
    title="Events"
    tableName="events"
    orderBy="start_datetime"
    orderAsc={false}
    fields={[
      { name: 'title', label: 'Title', type: 'text', required: true, showInTable: true },
      { name: 'slug', label: 'Slug', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea', showInTable: true },
      { name: 'cover_image_url', label: 'Cover Image', type: 'image', showInTable: true },
      { name: 'start_datetime', label: 'Start Date/Time', type: 'datetime', showInTable: true },
      { name: 'end_datetime', label: 'End Date/Time', type: 'datetime' },
      { name: 'location_mode', label: 'Location Mode', type: 'text' },
      { name: 'location_text', label: 'Location', type: 'text' },
      { name: 'registration_url', label: 'Registration URL', type: 'url' },
      { name: 'price', label: 'Price', type: 'number' },
      { name: 'capacity', label: 'Capacity', type: 'number' },
      { name: 'status', label: 'Status', type: 'text', defaultValue: 'active', showInTable: true },
      { name: 'tags', label: 'Tags', type: 'tags' },
    ]}
  />
);

export default EventsAdmin;
