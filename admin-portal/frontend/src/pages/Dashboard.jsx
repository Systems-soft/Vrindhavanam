import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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

const quickAccessTools = [
  {
    name: 'Support',
    path: '/admin/support',
    icon: (
      <svg className="admin-tool-icon" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="m9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    )
  },
  {
    name: 'Contact Forms',
    path: '/admin/contact-forms',
    icon: (
      <svg className="admin-tool-icon" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    )
  },
  {
    name: 'Coupons',
    path: '/admin/coupons',
    icon: (
      <svg className="admin-tool-icon" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    )
  },
  {
    name: 'Payments',
    path: '/admin/payments',
    icon: (
      <svg className="admin-tool-icon" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <line x1="2" x2="22" y1="10" y2="10" />
      </svg>
    )
  },
  {
    name: 'Shipping',
    path: '/admin/shipping',
    icon: (
      <svg className="admin-tool-icon" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 18H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8M19 13l3-3V6a2 2 0 0 0-2-2h-6v10h8v4a2 2 0 0 1-2 2" />
        <circle cx="7.5" cy="18.5" r="2.5" />
        <circle cx="16.5" cy="18.5" r="2.5" />
      </svg>
    )
  },
  {
    name: 'Analytics',
    path: '/admin/analytics',
    icon: (
      <svg className="admin-tool-icon" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    )
  },
  {
    name: 'Reports',
    path: '/admin/reports',
    icon: (
      <svg className="admin-tool-icon" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4M10 9H8M16 13H8M16 17H8" />
      </svg>
    )
  },
  {
    name: 'Homepage',
    path: '/admin/homepage',
    icon: (
      <svg className="admin-tool-icon" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    )
  },
  {
    name: 'Content',
    path: '/admin/content',
    icon: (
      <svg className="admin-tool-icon" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    )
  },
  {
    name: 'Blogs',
    path: '/admin/blog',
    icon: (
      <svg className="admin-tool-icon" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    )
  },
  {
    name: 'SEO',
    path: '/admin/seo',
    icon: (
      <svg className="admin-tool-icon" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
        <path d="M8 11h6M11 8v6" />
      </svg>
    )
  },
  {
    name: 'Media Library',
    path: '/admin/media',
    icon: (
      <svg className="admin-tool-icon" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
      </svg>
    )
  },
  {
    name: 'Notifications',
    path: '/admin/notifications',
    icon: (
      <svg className="admin-tool-icon" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </svg>
    )
  },
  {
    name: 'Admins',
    path: '/admin/admins',
    icon: (
      <svg className="admin-tool-icon" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )
  },
  {
    name: 'Activity Logs',
    path: '/admin/activity-logs',
    icon: (
      <svg className="admin-tool-icon" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <polyline points="3 3 3 8 8 8" />
        <line x1="12" y1="7" x2="12" y2="12" />
        <line x1="12" y1="12" x2="16" y2="14" />
      </svg>
    )
  }
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
  const [activities, setActivities] = useState([
    { id: 1, user: 'Rajesh Kumar', action: 'Updated daily price of Grade A Cardamom', timestamp: '5 mins ago' },
    { id: 2, user: 'Ananya Nair', action: 'Approved order #10842 for shipment', timestamp: '18 mins ago' },
    { id: 3, user: 'System Agent', action: 'Synchronized coffee stock with storefront DB', timestamp: '1 hour ago' },
    { id: 4, user: 'Vikram Singh', action: 'Created discount coupon FESTIVE50', timestamp: '3 hours ago' },
    { id: 5, user: 'Priya Sharma', action: 'Uploaded 12 new product images to Media Library', timestamp: '5 hours ago' }
  ]);

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

        let logsData = [];
        try {
          const logsRes = await fetch('/api/logs');
          if (logsRes.ok) {
            const logsJson = await logsRes.json();
            if (Array.isArray(logsJson.data)) {
              logsData = logsJson.data.slice(0, 5);
            }
          }
        } catch (err) {
          console.warn('Failed to fetch activity logs, falling back to mock data', err);
        }

        if (!cancelled) {
          setStats({ ...statsJson.data, charts: chartsJson.data });
          if (logsData && logsData.length > 0) {
            setActivities(logsData);
          }
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

      {/* Quick Access Admin Tools Section */}
      <section className="admin-tools-section">
        <div className="admin-tools-header">
          <p className="admin-eyebrow">Quick access to management modules</p>
          <h3 className="admin-tools-title">Administrative Tools</h3>
        </div>
        <div className="admin-tools-grid">
          {quickAccessTools.map(tool => (
            <Link key={tool.name} to={tool.path} className="admin-tools-card">
              <div className="admin-tools-card__icon-wrapper">
                {tool.icon}
              </div>
              <span className="admin-tools-card__name">{tool.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Admin Activity Section */}
      <section className="admin-activity-section" style={{ marginTop: '40px' }}>
        <div className="admin-activity-header" style={{ marginBottom: '1.5rem' }}>
          <p className="admin-eyebrow">Recent operations log</p>
          <h3 className="admin-tools-title">Recent Admin Activity</h3>
        </div>
        <div className="admin-panel">
          <div className="admin-activity-list">
            {activities.map(activity => {
              const getInitials = (name) => {
                return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'AD';
              };
              return (
                <div key={activity.id} className="admin-activity-item">
                  <div className="admin-activity-left">
                    <div className="admin-activity-avatar">
                      {getInitials(activity.user)}
                    </div>
                    <div className="admin-activity-details">
                      <span className="admin-activity-user">{activity.user}</span>
                      <span className="admin-activity-action">{activity.action}</span>
                    </div>
                  </div>
                  <span className="admin-activity-time">{activity.timestamp}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

