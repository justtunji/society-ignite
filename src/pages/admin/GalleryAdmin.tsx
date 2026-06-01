import CrudPage from './CrudPage';

const GalleryAdmin = () => (
  <CrudPage
    title="Gallery Items"
    tableName="gallery_items"
    orderBy="display_order"
    orderAsc={true}
    fields={[
      { name: 'title', label: 'Title', type: 'text', required: true, showInTable: true },
      { name: 'slug', label: 'Slug', type: 'text' },
      { name: 'image_url', label: 'Image', type: 'image', required: true, showInTable: true },
      { name: 'caption', label: 'Caption', type: 'textarea', showInTable: true },
      { name: 'category', label: 'Category', type: 'text', showInTable: true },
      { name: 'photographer_credit', label: 'Photographer Credit', type: 'text' },
      { name: 'display_order', label: 'Display Order', type: 'number', defaultValue: 0, showInTable: true },
      { name: 'visible', label: 'Visible', type: 'boolean', defaultValue: true, showInTable: true },
    ]}
  />
);

export default GalleryAdmin;
