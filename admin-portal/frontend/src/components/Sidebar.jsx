import { NavLink } from 'react-router-dom';

const navItems = [
  { name: 'Dashboard', path: '/' },
  { name: 'Customers', path: '/admin/customers' },
  { name: 'Orders', path: '/admin/orders' },
  { name: 'Products', path: '/admin/products' },
  { name: 'Variants', path: '/admin/variants' },
  { name: 'Inventory', path: '/admin/inventory' },
  { name: 'Harvest', path: '/admin/harvests' },
  { name: 'Batches', path: '/admin/batches' },
  { name: 'Quality Grades', path: '/admin/grades' },
  { name: 'Subscriptions', path: '/admin/subscriptions' },
  { name: 'WhatsApp', path: '/admin/whatsapp' },
  { name: 'Stock Alerts', path: '/admin/stock-alerts' },
  { name: 'Reviews', path: '/admin/reviews' },
  { name: 'Support', path: '/admin/support' },
  { name: 'Contact Forms', path: '/admin/contact-forms' },
  { name: 'Coupons', path: '/admin/coupons' },
  { name: 'Payments', path: '/admin/payments' },
  { name: 'Shipping', path: '/admin/shipping' },
  { name: 'Analytics', path: '/admin/analytics' },
  { name: 'Reports', path: '/admin/reports' },
  { name: 'Homepage', path: '/admin/homepage' },
  { name: 'Content', path: '/admin/content' },
  { name: 'Blogs', path: '/admin/blog' },
  { name: 'SEO', path: '/admin/seo' },
  { name: 'Media Library', path: '/admin/media' },
  { name: 'Notifications', path: '/admin/notifications' },
  { name: 'Admins', path: '/admin/admins' },
  { name: 'Activity Logs', path: '/admin/activity-logs' },
  { name: 'Settings', path: '/admin/settings' },
  { name: 'Backups', path: '/admin/backups' },
  { name: 'AI Insights', path: '/admin/ai' },
];

export default function Sidebar({ collapsed, toggle }) {
  return (
    <aside className={`admin-sidebar ${collapsed ? 'is-collapsed' : ''}`}>
      <div className="admin-sidebar__brand">
        <img
          className="admin-sidebar__logo"
          src="/images/logo.png"
          alt="Vrindhavanam Estate Heritage Since 1932 Logo"
        />
        {!collapsed && (
          <span className="brand-lockup">
            <span className="brand-title">Vrindhavanam Estate</span>
            <span className="brand-subtitle">Heritage Since 1932</span>
          </span>
        )}
      </div>
      <button className="admin-sidebar__toggle" type="button" onClick={toggle}>
        {collapsed ? '→' : '←'}
      </button>
      <nav className="admin-sidebar__nav">
        {navItems.map(item => (
          <NavLink
            key={item.path + item.name}
            to={item.path}
            className={({ isActive }) => `admin-sidebar__link ${isActive ? 'is-active' : ''}`}
          >
            <span className="admin-sidebar__dot" />
            {!collapsed && item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
