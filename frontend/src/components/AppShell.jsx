import { NavLink, Outlet } from 'react-router-dom';

const navigation = [
  { to: '/', label: 'Home' },
  { to: '/builder', label: 'Builder' },
  { to: '/guides', label: 'Guides' },
  { to: '/comparison', label: 'Comparison' },
  { to: '/price-trends', label: 'Price Trends' },
  { to: '/health-report', label: 'Health Report' },
  { to: '/performance', label: 'Performance' },
];

function AppShell() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="site-header__inner">
          <NavLink to="/" className="brand">
            <span className="brand__mark">PC</span>
            <span className="brand__text">
              <strong>MyPCBuilder</strong>
              <small>Reference Workspace</small>
            </span>
          </NavLink>

          <nav className="site-nav" aria-label="Primary">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  isActive ? 'site-nav__link site-nav__link--active' : 'site-nav__link'
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="site-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AppShell;
