import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboard = location.pathname === '/' || location.pathname === '';

  useEffect(() => {
    const session = window.localStorage.getItem('vrindhavanam_admin_session');
    if (!session) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    window.localStorage.removeItem('vrindhavanam_admin_session');
    navigate('/login', { replace: true });
  };

  return (
    <div className={`admin-shell ${collapsed ? 'is-collapsed' : ''}`}>
      <Sidebar collapsed={collapsed} toggle={() => setCollapsed(value => !value)} />
      <div className="admin-shell__main">
        <header className="admin-header">
          <span className="brand-lockup">
            <span className="brand-title">Vrindhavanam Estate</span>
            <span className="brand-subtitle">Heritage Since 1932</span>
          </span>
          <div className="admin-header__actions">
            <button className="admin-button admin-button--ghost" type="button">
              Activity Log
            </button>
            <button className="admin-button" type="button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>
        <main className={`admin-content${isDashboard ? '' : ' admin-content--cinematic'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

