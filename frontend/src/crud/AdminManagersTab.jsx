import { useState, useEffect } from 'react';
import axios from 'axios';
import { theme, inputStyle, btnPrimary, btnDanger } from './adminTheme';

const API_BASE = 'http://127.0.0.1:8000/api';

function AdminManagersTab({ setActiveTab }) {
  const [managers, setManagers] = useState([]);
  const [managerForm, setManagerForm] = useState({ email: '', password: '', username: '' });

  const axiosPrivate = axios.create({
    baseURL: API_BASE,
    headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}`, 'Accept': 'application/json' },
  });

  const fetchManagers = () => {
    axiosPrivate.get('/managers')
      .then(response => setManagers(response.data.data))
      .catch(() => {});
  };

  useEffect(() => { fetchManagers(); }, []);

  const handleCreateManager = (e) => {
    e.preventDefault();
    axiosPrivate.post('/managers', managerForm)
      .then(() => {
        alert('Tạo tài khoản Manager thành công!');
        setManagerForm({ email: '', password: '', username: '' });
        fetchManagers();
      })
      .catch(err => {
        const msg = err.response?.data?.message || 'Có lỗi xảy ra!';
        alert(msg);
      });
  };

  const handleDeleteManager = (id, email) => {
    if (window.confirm(`Xóa tài khoản manager "${email}"?`)) {
      axiosPrivate.delete(`/managers/${id}`)
        .then(() => {
          setManagers(managers.filter(m => m.id !== id));
          alert('Đã xóa tài khoản!');
        })
        .catch(() => alert('Lỗi khi xóa!'));
    }
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <button onClick={() => setActiveTab('dashboard')} style={{ background: 'none', border: 'none', color: theme.muted, cursor: 'pointer', fontFamily: theme.font, fontSize: '0.88rem', padding: 0 }}>Tổng quan</button>
        <span style={{ color: theme.muted }}>/</span>
        <span style={{ color: theme.text, fontWeight: 600, fontSize: '0.88rem' }}>Quản Lý Manager</span>
      </div>

      <div style={{ background: theme.panel, padding: 24, borderRadius: 24, border: `1px solid ${theme.border}`, boxShadow: theme.shadow }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <span className="material-symbols-outlined" style={{ color: theme.ok, fontSize: 22 }}>group_add</span>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Quản Lý Tài Khoản Manager</h2>
        </div>

        {/* Form tạo manager */}
        <div style={{ padding: 18, borderRadius: 16, marginBottom: 20, background: 'rgba(146, 183, 201, 0.05)', border: `1px solid ${theme.border}` }}>
          <h4 style={{ margin: '0 0 12px', fontSize: '0.95rem', color: theme.muted }}>Tạo Tài Khoản Manager Mới</h4>
          <form onSubmit={handleCreateManager} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <input type="text" placeholder="Username" value={managerForm.username} onChange={e => setManagerForm({ ...managerForm, username: e.target.value })} style={{ ...inputStyle, flex: 1, minWidth: 140 }} />
            <input type="email" placeholder="Email" value={managerForm.email} onChange={e => setManagerForm({ ...managerForm, email: e.target.value })} required style={{ ...inputStyle, flex: 2, minWidth: 200 }} />
            <input type="password" placeholder="Mật khẩu (≥6 ký tự)" value={managerForm.password} onChange={e => setManagerForm({ ...managerForm, password: e.target.value })} required minLength={6} style={{ ...inputStyle, flex: 1, minWidth: 180 }} />
            <button type="submit" style={{ ...btnPrimary, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>person_add</span>
              Tạo Manager
            </button>
          </form>
        </div>

        {/* Danh sách managers */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                {['ID', 'Username', 'Email', 'Ngày tạo'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', color: theme.muted, fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
                <th style={{ padding: '12px 14px', textAlign: 'center', color: theme.muted, fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {managers.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: 20, textAlign: 'center', color: theme.muted }}>Chưa có tài khoản manager nào.</td></tr>
              ) : managers.map(m => (
                <tr key={m.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                  <td style={{ padding: '14px', color: theme.muted }}>{m.id}</td>
                  <td style={{ padding: '14px', fontWeight: 600 }}>{m.username}</td>
                  <td style={{ padding: '14px', color: theme.muted }}>{m.email}</td>
                  <td style={{ padding: '14px', color: theme.muted, fontSize: '0.85rem' }}>{new Date(m.created_at).toLocaleDateString('vi-VN')}</td>
                  <td style={{ padding: '14px', textAlign: 'center' }}>
                    <button onClick={() => handleDeleteManager(m.id, m.email)} style={{ ...btnDanger, padding: '6px 14px', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default AdminManagersTab;
