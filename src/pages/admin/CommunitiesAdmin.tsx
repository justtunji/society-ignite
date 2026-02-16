import CrudPage from './CrudPage';

const CommunitiesAdmin = () => (
  <CrudPage
    title="Communities"
    tableName="communities"
    orderBy="order_index"
    orderAsc={true}
    slugField={false}
    fields={[
      { name: 'name', label: 'Name', type: 'text', required: true, showInTable: true },
      { name: 'description', label: 'Description', type: 'textarea', showInTable: true },
      { name: 'link', label: 'Link', type: 'url', showInTable: true },
      { name: 'order_index', label: 'Order', type: 'number', defaultValue: 0, showInTable: true },
      { name: 'visible', label: 'Visible', type: 'boolean', defaultValue: true, showInTable: true },
    ]}
  />
);

export default CommunitiesAdmin;
