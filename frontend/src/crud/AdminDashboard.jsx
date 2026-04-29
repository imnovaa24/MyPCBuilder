import { useState, useEffect } from 'react';
import axios from 'axios';
import { theme, btnPrimary, btnGhost } from './adminTheme';

const API_BASE = 'http://127.0.0.1:8000/api';

function AdminDashboard({ setActiveTab, isAdmin }) {
  const [stats, setStats] = useState({ components: 0, featured: 0, users: 0, managers: 0, categories: 0 });

  const axiosPrivate = axios.create({
    baseURL: API_BASE,
    headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}`, 'Accept': 'application/json' },
  });

  useEffect(() => {
    Promise.all([
      axios.get(`${API_BASE}/components`),
      axios.get(`${API_BASE}/featured-builds`),
      axios.get(`${API_BASE}/categories`),
      axiosPrivate.get('/users').catch(() => ({ data: { data: [] } })),
      isAdmin ? axiosPrivate.get('/managers').catch(() => ({ data: { data: [] } })) : Promise.resolve({ data: { data: [] } }),
    ]).then(([compRes, featRes, catRes, userRes, mgrRes]) => {
      setStats({
        components: (compRes.data.data || []).length,
        featured: (featRes.data.data || []).length,
        categories: (catRes.data.data || []).length,
        users: (userRes.data.data || []).length,
        managers: (mgrRes.data.data || []).length,
      });
    });
  }, []);

  const dashboardCards = [
    { id: 'components', icon: 'inventory_2', color: theme.primary, label: 'Linh Kiện', value: stats.components, desc: 'sản phẩm trong kho' },
    { id: 'featured', icon: 'star', color: theme.warn, label: 'Cấu Hình Phổ Biến', value: stats.featured, desc: 'cấu hình đang hiển thị' },
    { id: 'users', icon: 'person', color: '#38bdf8', label: 'Tài Khoản User', value: stats.users, desc: 'tài khoản đã đăng ký' },
    ...(isAdmin ? [{ id: 'managers', icon: 'group', color: theme.ok, label: 'Manager', value: stats.managers, desc: 'tài khoản quản lý' }] : []),
    { id: 'categories', icon: 'category', color: '#c084fc', label: 'Danh Mục', value: stats.categories, desc: 'loại linh kiện' },
  ];

  return (
    <>
      {/* Hero */}
      <div style={{
        padding: '28px 32px', marginBottom: 24, borderRadius: 24,
        background: 'radial-gradient(circle at right top, rgba(19,164,236,0.16), transparent 26%), linear-gradient(180deg, rgba(27,47,57,0.98), rgba(14,24,30,0.96))',
        border: `1px solid ${theme.border}`, boxShadow: theme.shadow,
      }}>
        <p style={{ margin: '0 0 8px', color: theme.primary, textTransform: 'uppercase', letterSpacing: '0.14em', fontSize: '0.78rem', fontWeight: 700 }}>Bảng điều khiển</p>
        <h1 style={{ margin: 0, fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', lineHeight: 1.1 }}>Xin chào, {isAdmin ? 'Admin' : 'Manager'}!</h1>
        <p style={{ margin: '10px 0 0', color: theme.muted, fontSize: '1rem' }}>Quản lý linh kiện, cấu hình phổ biến và tài khoản từ đây.</p>
      </div>

      {/* Thẻ thống kê */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 18, marginBottom: 24 }}>
        {dashboardCards.map(card => (
          <button key={card.id} onClick={() => { if (card.id !== 'categories') setActiveTab(card.id); }} style={{
            background: theme.panel, padding: '22px 24px', borderRadius: 20,
            border: `1px solid ${theme.border}`, boxShadow: theme.shadow,
            cursor: card.id !== 'categories' ? 'pointer' : 'default',
            textAlign: 'left', fontFamily: theme.font, color: theme.text,
            transition: '0.2s', display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 14, display: 'grid', placeItems: 'center',
                background: `${card.color}18`, color: card.color,
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 24 }}>{card.icon}</span>
              </div>
              {card.id !== 'categories' && (
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: theme.muted }}>arrow_forward</span>
              )}
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1 }}>{card.value}</div>
              <div style={{ color: theme.muted, fontSize: '0.85rem', marginTop: 4 }}>{card.desc}</div>
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: card.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{card.label}</div>
          </button>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{
        background: theme.panel, padding: 24, borderRadius: 24,
        border: `1px solid ${theme.border}`, boxShadow: theme.shadow,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <span className="material-symbols-outlined" style={{ color: theme.primary, fontSize: 20 }}>bolt</span>
          <h3 style={{ margin: 0, fontSize: '1.05rem' }}>Thao tác nhanh</h3>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab('components')} style={{ ...btnPrimary, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add_circle</span>
            Thêm linh kiện
          </button>
          <button onClick={() => setActiveTab('featured')} style={{ ...btnGhost, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>star</span>
            Sửa cấu hình phổ biến
          </button>
          {isAdmin && (
            <button onClick={() => setActiveTab('managers')} style={{ ...btnGhost, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>person_add</span>
              Tạo tài khoản manager
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
