import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { theme, btnGhost, btnDanger } from './adminTheme';
import AdminDashboard from './AdminDashboard';
import AdminComponentsTab from './AdminComponentsTab';
import AdminFeaturedTab from './AdminFeaturedTab';
import AdminUsersTab from './AdminUsersTab';
import AdminManagersTab from './AdminManagersTab';

function AdminPanel({ onLogout }) {
  const currentRole = localStorage.getItem('adminRole') || 'manager';
  const isAdmin = currentRole === 'admin';
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminRole');
    localStorage.removeItem('adminUser');
    onLogout(false);
    navigate('/');
  };

  const tabs = [
    { id: 'dashboard', label: 'Tổng quan', icon: 'dashboard' },
    { id: 'components', label: 'Linh Kiện', icon: 'inventory_2' },
    { id: 'featured', label: 'Cấu Hình Phổ Biến', icon: 'star' },
    { id: 'users', label: 'Tài Khoản User', icon: 'person' },
    ...(isAdmin ? [{ id: 'managers', label: 'Quản Lý Manager', icon: 'group' }] : []),
  ];

  const logoSvg = (
    <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="currentColor" fillRule="evenodd"></path>
      <path clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fill="currentColor" fillRule="evenodd"></path>
    </svg>
  );

  return (
    <div style={{ minHeight: '100vh', background: theme.bgGrad, fontFamily: theme.font, color: theme.text }}>

      {/* ===== HEADER ===== */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: `1px solid ${theme.border}`,
        background: 'rgba(8, 19, 26, 0.8)', backdropFilter: 'blur(12px)',
        padding: '12px 40px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: theme.text }}>
            <div style={{ width: 28, height: 28, color: theme.primary }}>{logoSvg}</div>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.015em' }}>PC Builder Pro</span>
          </Link>
          <span style={{ color: theme.muted, fontSize: '0.8rem', padding: '4px 10px', borderRadius: '999px', background: 'rgba(19,164,236,0.12)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{isAdmin ? 'Admin' : 'Manager'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link to="/" style={{ ...btnGhost, padding: '8px 16px', fontSize: '0.85rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>home</span>
            Trang chủ
          </Link>
          <button onClick={handleLogoutClick} style={{ ...btnDanger, padding: '8px 16px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>
            Đăng Xuất
          </button>
        </div>
      </header>

      {/* ===== LAYOUT: SIDEBAR + NỘI DUNG ===== */}
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 57px)' }}>

        {/* SIDEBAR */}
        <aside style={{
          width: 240, flexShrink: 0, padding: '20px 12px',
          background: 'rgba(8, 19, 26, 0.5)', borderRight: `1px solid ${theme.border}`,
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '11px 16px', borderRadius: 12,
              border: 'none', cursor: 'pointer', fontFamily: theme.font,
              fontSize: '0.88rem', fontWeight: activeTab === tab.id ? 700 : 500,
              color: activeTab === tab.id ? theme.text : theme.muted,
              background: activeTab === tab.id ? 'rgba(19,164,236,0.12)' : 'transparent',
              transition: '0.15s',
              textAlign: 'left', width: '100%',
            }}>
              <span className="material-symbols-outlined" style={{
                fontSize: 20,
                color: activeTab === tab.id ? theme.primary : theme.muted,
              }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </aside>

        {/* MAIN CONTENT */}
        <main style={{ flex: 1, padding: '28px 32px 64px', overflowY: 'auto', maxHeight: 'calc(100vh - 57px)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            {activeTab === 'dashboard' && <AdminDashboard setActiveTab={setActiveTab} isAdmin={isAdmin} />}
            {activeTab === 'components' && <AdminComponentsTab setActiveTab={setActiveTab} />}
            {activeTab === 'featured' && <AdminFeaturedTab setActiveTab={setActiveTab} />}
            {activeTab === 'users' && <AdminUsersTab setActiveTab={setActiveTab} />}
            {activeTab === 'managers' && isAdmin && <AdminManagersTab setActiveTab={setActiveTab} />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminPanel;
