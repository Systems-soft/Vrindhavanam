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
import InventoryPage from "./pages/InventoryPage";
import HarvestPage from "./pages/HarvestPage";
import BatchesPage from "./pages/BatchesPage";
import QualityGradesPage from "./pages/QualityGradesPage";
import WhatsappPage from "./pages/WhatsappPage";
import StockAlertsPage from "./pages/StockAlertsPage";
import ReviewsPage from "./pages/ReviewsPage";
import SupportPage from "./pages/SupportPage";
import ContactFormsPage from "./pages/ContactFormsPage";
import CouponsPage from "./pages/CouponsPage";
import ShippingPage from "./pages/ShippingPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ReportsPage from "./pages/ReportsPage";
import HomePage from "./pages/HomePage";
import ContentsPage from "./pages/ContentsPage";
import BlogsPage from "./pages/BlogsPage";
import BlogEditorPage from "./pages/BlogsEditorPage";
import SEOPage from "./pages/SEOPage";
import MediaLibraryPage from "./pages/MediaLibraryPage";
import NotificationsPage from "./pages/NotificationsPage";
import AdminsPage from "./pages/AdminsPage";
import ActivityLogsPage from "./pages/ActivityLogsPage";
import SettingsPage from "./pages/SettingsPage";
import BackupsPage from "./pages/BackupsPage";
import AIInsightsPage from "./pages/AIInsightsPage";
import SubscriptionPage from "./pages/SubscriptionPage";

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
  whatsapp: 'WhatsApp Marketing',
  admins: 'Admin Management',
  'activity-logs': 'Activity Logs',
  backups: 'Backups',
  content: 'CMS Content',
  seo: 'SEO',
  media: 'Media Library',
  notifications: 'Notifications',
  ai: 'AI Insights',
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
<Route
  path="/admin/inventory"
  element={<InventoryPage />}
/>
<Route
  path="/admin/harvests"
  element={<HarvestPage />}
/>
<Route
  path="/admin/batches"
  element={<BatchesPage />}
/>
<Route
  path="/admin/grades"
  element={<QualityGradesPage />}
/>

<Route
 path="/admin/whatsapp"
 element={<WhatsappPage />}
/>

<Route
  path="/admin/stock-alerts"
  element={<StockAlertsPage />}
/>

<Route
  path="/admin/reviews"
  element={<ReviewsPage />}
/>
<Route
  path="/admin/support"
  element={<SupportPage />}
/>
<Route
  path="/admin/contact-forms"
  element={<ContactFormsPage />}
/>
<Route
 path="/admin/coupons"
 element={<CouponsPage />}
/>

<Route
 path="/admin/shipping"
 element={<ShippingPage />}
/>

<Route
 path="/admin/analytics"
 element={<AnalyticsPage />}
/>

<Route path="/admin/reports" element={<ReportsPage />} />

<Route path="/admin/homepage" element={<HomePage />} />

<Route path="/admin/content" element={<ContentsPage />} />

<Route path="/admin/blog" element={<BlogsPage />} />

<Route
 path="/admin/blogs/new"
 element={<BlogEditorPage />}
/>

<Route
 path="/admin/blogs/:id"
 element={<BlogEditorPage />}
/>

<Route
 path="/admin/seo"
 element={<SEOPage />}
/>

<Route
 path="/admin/media"
 element={<MediaLibraryPage />}
/>

<Route
 path="/admin/notifications"
 element={<NotificationsPage />}
/>

<Route
 path="/admin/admins"
 element={<AdminsPage />}
/>

<Route
 path="/admin/activity-logs"
 element={<ActivityLogsPage />}
/>

<Route
 path="/admin/settings"
 element={<SettingsPage />}
/>

<Route
path="/admin/backups"
element={<BackupsPage />}
/>

<Route
path="/admin/ai"
element={<AIInsightsPage />}
/>

<Route
    path="/admin/subscriptions"
    element={<SubscriptionPage />}
/>

{Object.entries(modulePages)
.filter(
  ([slug]) =>
    slug !== "products" &&
    slug !== "variants" &&
    slug !== "orders" &&
    slug !== "harvests" &&
    slug !== "inventory" &&
    slug !== "customers" &&
    slug !== "batches" &&
    slug !== "grades" &&
    slug !== "whatsapp" &&
    slug !== "stock-alerts" &&
    slug !== "reviews" &&
    slug !== "support" &&
   slug !== "contact-forms" &&
   slug !== "coupons" &&
    slug !== "shipping" &&
    slug !== "analytics" &&
    slug !== "reports" &&
    slug !== "homepage" &&
    slug !== "content" &&
    slug !== "blogs" &&
    slug !== "blog" &&
    slug !== "seo" &&
    slug !== "media" &&
    slug !== "notifications" &&
    slug !== "admins" &&
    slug !== "settings" &&
    slug !== "backups" &&
    slug !== "AIInsights"
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
