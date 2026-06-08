import CrudPage from './CrudPage';

const PartnersAdmin = () => (
  <CrudPage
    module="partners"
    title="Partners"
    tableName="partners"
    orderBy="order_index"
    orderAsc={true}
    slugField={false}
    fields={[
      { name: 'name', label: 'Name', type: 'text', required: true, showInTable: true },
      { name: 'logo_url', label: 'Logo', type: 'image', showInTable: true },
      { name: 'website_url', label: 'Website URL', type: 'url', showInTable: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'tier', label: 'Tier', type: 'text', showInTable: true },
      { name: 'order_index', label: 'Order', type: 'number', defaultValue: 0, showInTable: true },
      { name: 'is_active', label: 'Active', type: 'boolean', defaultValue: true },
      { name: 'carousel_visible', label: 'Show in Carousel', type: 'boolean', defaultValue: true },
      { name: 'target_blank', label: 'Open in New Tab', type: 'boolean', defaultValue: true },
    ]}
  />
);

export default PartnersAdmin;
