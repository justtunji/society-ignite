import CrudPage from './CrudPage';

const StoriesAdmin = () => (
  <CrudPage
    module="stories"
    title="Stories"
    tableName="stories"
    orderBy="order_index"
    orderAsc={true}
    fields={[
      { name: 'title', label: 'Title', type: 'text', required: true, showInTable: true },
      { name: 'slug', label: 'Slug', type: 'text' },
      { name: 'image_url', label: 'Image', type: 'image', showInTable: true },
      { name: 'short_description', label: 'Short Description', type: 'textarea', showInTable: true },
      { name: 'link', label: 'Link', type: 'url', showInTable: true },
      { name: 'published_at', label: 'Published At', type: 'datetime' },
      { name: 'featured', label: 'Featured', type: 'boolean', defaultValue: false, showInTable: true },
      { name: 'order_index', label: 'Order', type: 'number', defaultValue: 0 },
    ]}
  />
);

export default StoriesAdmin;
