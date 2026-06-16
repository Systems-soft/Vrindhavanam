const highlights = {
  customers: ['CRUD ready', 'Profiles', 'Search + filters', 'Lifetime value'],
  orders: ['Order list', 'Status updates', 'Invoice PDF', 'Print and email'],
  products: ['Categories', 'Status workflow', 'Inventory link', 'Media fields'],
  inventory: ['Stock dashboard', 'Adjustments', 'Movement history', 'Alerts'],
  subscriptions: ['Newsletter', 'WhatsApp', 'Product', 'Stock alerts'],
  analytics: ['Revenue', 'Customer', 'Product', 'Subscriptions'],
  reports: ['CSV export', 'Excel export', 'PDF export', 'Scheduled delivery'],
};

export default function ModulePage({ title, slug }) {
  const chips = highlights[slug] || ['Module scaffold', 'API integration pending', 'UI ready for expansion'];

  return (
    <section className="admin-panel">
      <p className="admin-eyebrow">{title}</p>
      <h3>{title} module</h3>
      <p>
        This page is wired into the admin portal so the missing module is reachable from the
        sidebar and ready for API-backed implementation.
      </p>
      <div className="admin-chip-row">
        {chips.map(item => (
          <span key={item} className="admin-chip admin-chip--static">
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
