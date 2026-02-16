import CrudPage from './CrudPage';

const TeamAdmin = () => (
  <CrudPage
    title="Team Members"
    tableName="team_members"
    orderBy="order_index"
    orderAsc={true}
    slugField={false}
    fields={[
      { name: 'name', label: 'Name', type: 'text', required: true, showInTable: true },
      { name: 'title', label: 'Title / Role', type: 'text', showInTable: true },
      { name: 'bio', label: 'Bio', type: 'textarea' },
      { name: 'image_url', label: 'Photo', type: 'image', showInTable: true },
      { name: 'email', label: 'Email', type: 'text' },
      { name: 'linkedin_url', label: 'LinkedIn URL', type: 'url' },
      { name: 'twitter_url', label: 'Twitter URL', type: 'url' },
      { name: 'order_index', label: 'Order', type: 'number', defaultValue: 0, showInTable: true },
      { name: 'is_featured', label: 'Featured', type: 'boolean', defaultValue: false, showInTable: true },
    ]}
  />
);

export default TeamAdmin;
