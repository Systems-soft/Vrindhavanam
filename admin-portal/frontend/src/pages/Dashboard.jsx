import { useEffect, useState } from 'react';

const fallbackMetrics = [
  { label: 'Revenue Today', key: 'revenueToday', accent: 'amber', format: 'currency' },
  { label: 'Revenue Month', key: 'revenueMonth', accent: 'green', format: 'currency' },
  { label: 'Total Orders', key: 'totalOrders', accent: 'rose' },
  { label: 'Pending Orders', key: 'pendingOrders', accent: 'blue' },
  { label: 'Delivered Orders', key: 'deliveredOrders', accent: 'violet' },
  { label: 'Total Customers', key: 'totalCustomers', accent: 'teal' },
  { label: 'Active Subscribers', key: 'activeSubscribers', accent: 'amber' },
  { label: 'Low Stock Products', key: 'lowStockProducts', accent: 'green' },
  { label: 'Out Of Stock Products', key: 'outOfStockProducts', accent: 'rose' },
];

const chartCards = [
  'Sales Trend',
  'Customer Growth',
  'Product Sales',
  'Subscription Revenue',
];

function formatValue(value, format) {
  if (format === 'currency') {
    return `₹${Number(value || 0).toLocaleString('en-IN')}`;
  }
  return Number(value || 0).toLocaleString('en-IN');
}

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        const [statsRes, chartsRes] = await Promise.all([
          fetch('/api/admin/dashboard/stats'),
          fetch('/api/admin/dashboard/charts'),
        ]);

        const statsJson = await statsRes.json();
        const chartsJson = await chartsRes.json();

        if (!cancelled) {
          setStats({ ...statsJson.data, charts: chartsJson.data });
          setLoading(false);
        }
      } catch (error) {
        console.error('Dashboard load failed', error);
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="admin-dashboard admin-dashboard--home">
      <section className="admin-hero">
        <div>
          <p className="admin-eyebrow">Live admin data</p>
          <h2>Operational overview for the Vrindhavanam team</h2>
          <p>
            The dashboard now reads from the shared MySQL database powering the storefront, so the
            admin cards stay in sync with real commerce data.
          </p>
        </div>
        <div className="admin-hero__panel">
          <span>System status</span>
          <strong>{loading ? 'Loading...' : 'Connected'}</strong>
          <small>Live stats and charts from /api/admin/dashboard</small>
        </div>
      </section>

      <section className="admin-grid">
        {fallbackMetrics.map(card => (
          <article key={card.key} className={`admin-card admin-card--${card.accent}`}>
            <span>{card.label}</span>
            <strong>{loading ? '—' : formatValue(stats?.[card.key], card.format)}</strong>
          </article>
        ))}
      </section>

      <section className="admin-panels">
        <article className="admin-panel">
          <h3>Quick actions</h3>
          <div className="admin-chip-row">
            {['Import Excel', 'Create Product', 'Review Orders', 'Audit Inventory'].map(action => (
              <button key={action} className="admin-chip" type="button">
                {action}
              </button>
            ))}
          </div>
        </article>

        <article className="admin-panel">
          <h3>Charts</h3>
          <div className="admin-chip-row">
            {chartCards.map(chart => (
              <span key={chart} className="admin-chip admin-chip--static">
                {chart}
              </span>
            ))}
          </div>
        </article>
      </section>

      <section className="admin-panels">
        <article className="admin-panel">
          <h3>Live API snapshot</h3>
          <ol className="admin-roadmap">
            <li>GET /api/admin/dashboard/stats</li>
            <li>GET /api/admin/dashboard/charts</li>
            <li>GET /api/admin/products</li>
            <li>GET /api/admin/orders</li>
          </ol>
        </article>
        <article className="admin-panel">
          <h3>Live data sources</h3>
          <ol className="admin-roadmap">
            <li>MySQL products table from the storefront sync</li>
            <li>MySQL orders table for commerce metrics</li>
            <li>MySQL customers table for CRM metrics</li>
            <li>Shared admin backend service layer</li>
          </ol>
        </article>
      </section>
    </div>
  );
}
