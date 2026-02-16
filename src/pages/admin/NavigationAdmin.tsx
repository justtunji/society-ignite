import CrudPage from './CrudPage';

const NavigationAdmin = () => (
  <CrudPage
    title="Navigation Items"
    tableName="navigation_items"
    orderBy="order_index"
    orderAsc={true}
    slugField={false}
    fields={[
      { name: 'label', label: 'Label', type: 'text', required: true, showInTable: true },
      { name: 'url', label: 'URL', type: 'text', required: true, showInTable: true },
      { name: 'order_index', label: 'Order', type: 'number', defaultValue: 0, showInTable: true },
      { name: 'external', label: 'External Link', type: 'boolean', defaultValue: false, showInTable: true },
      { name: 'cta_style', label: 'CTA Style', type: 'boolean', defaultValue: false },
      { name: 'visible', label: 'Visible', type: 'boolean', defaultValue: true, showInTable: true },
    ]}
  />
);

export default NavigationAdmin;
