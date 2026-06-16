import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ModulePage from './pages/ModulePage';
import ProductsPage from './pages/ProductsPage';
import VariantsPage from './pages/VariantsPage';
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import CustomersPage from "./pages/CustomersPage";

const modulePages = {
  orders: 'Orders',
  products: 'Products',
  inventory: 'Inventory',
  customers: 'Customers',
  'excel-import': 'Excel Import',
  subscriptions: 'Subscriptions',
  settings: 'Settings',
  reports: 'Reports',
  analytics: 'Analytics',
  coupons: 'Coupons',
  payments: 'Payments',
  shipping: 'Shipping',
  'stock-alerts': 'Stock Alerts',
  reviews: 'Reviews',
  support: 'Support',
  newsletter: 'Newsletter',
  whatsapp: 'WhatsApp Marketing',
  admins: 'Admin Management',
  'activity-logs': 'Activity Logs',
  backups: 'Backups',
  content: 'CMS Content',
  seo: 'SEO',
  media: 'Media Library',
  notifications: 'Notifications',
  ai: 'AI Insights',
  harvest: 'Harvest',
  batches: 'Batches',
  grades: 'Quality Grades',
  blog: 'Blog System',
  homepage: 'Homepage Builder',
  'contact-forms': 'Contact Forms',
};

function ProtectedRoute() {
  const session = window.localStorage.getItem('vrindhavanam_admin_session');
  if (!session) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route
  path="/checkout"
  element={<CheckoutPage />}
/>
<Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route
path="/admin/products"
element={<ProductsPage />}
/>
<Route
path="/admin/variants"
element={<VariantsPage />}
/>
<Route
  path="/admin/orders"
  element={<OrdersPage />}
/>
<Route
  path="/admin/customers"
  element={<CustomersPage />}
/>
{Object.entries(modulePages)
.filter(
  ([slug]) =>
    slug !== 'products' &&
    slug !== 'variants' &&
    slug !== 'orders'
)
.map(([slug, title]) => (
<Route
key={slug}
path={`/admin/${slug}`}
element={<ModulePage title={title} slug={slug} />}
/>
))}

        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
