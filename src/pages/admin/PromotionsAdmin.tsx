import CrudPage from './CrudPage';

const PromotionsAdmin = () => (
  <CrudPage
    title="Promotions"
    tableName="promotions"
    orderBy="order_index"
    orderAsc={true}
    fields={[
      { name: 'title', label: 'Title', type: 'text', required: true, showInTable: true },
      { name: 'slug', label: 'Slug', type: 'text' },
      { name: 'sponsor_name', label: 'Sponsor Name', type: 'text', showInTable: true },
      { name: 'image_url', label: 'Image', type: 'image', showInTable: true },
      { name: 'short_description', label: 'Short Description', type: 'textarea', showInTable: true },
      { name: 'long_description', label: 'Full Description', type: 'textarea' },
      { name: 'link', label: 'Link', type: 'url' },
      { name: 'start_date', label: 'Start Date', type: 'date' },
      { name: 'end_date', label: 'End Date', type: 'date' },
      { name: 'featured', label: 'Featured', type: 'boolean', defaultValue: false, showInTable: true },
      { name: 'order_index', label: 'Order', type: 'number', defaultValue: 0 },
    ]}
  />
);

export default PromotionsAdmin;
